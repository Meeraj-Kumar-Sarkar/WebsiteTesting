import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { config } from '../../config/index.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const financeController = {
  // 1. Finance Dashboard Metrics
  async getDashboardMetrics(req, res) {
    try {
      const invoices = store.get('invoices');
      const payments = store.get('payments');
      const tripRequests = store.get('tripRequests');
      const refundRequests = store.get('refundRequests');
      const financialReports = store.get('financialReports');

      const awaitingVerification = payments.filter(p => p.status === 'PENDING_VERIFICATION');
      const unpaidInvoices = invoices.filter(i => i.status === 'UNPAID');
      
      const today = new Date().toISOString().split('T')[0];
      const overdueInvoices = invoices.filter(i => i.status === 'UNPAID' && i.dueDate && i.dueDate < today);

      const totalInvoiced = invoices.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
      const amountCollected = payments.filter(p => p.status === 'VERIFIED').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const outstandingReceivables = invoices.reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);

      const refundsPendingCalculation = refundRequests.filter(r => r.status === 'PENDING_CALCULATION');
      const refundsPendingExecution = refundRequests.filter(r => r.status === 'APPROVED_PENDING_EXECUTION');
      const refundsCompleted = refundRequests.filter(r => r.status === 'COMPLETED');

      // Estimated vs actual direct costs
      let totalEstimatedCost = 0;
      let totalAgreedRevenue = 0;
      for (const r of financialReports) {
        totalEstimatedCost += Number(r.estimatedSupplierExpense) || 0;
        totalAgreedRevenue += Number(r.agreedCustomerPrice) || 0;
      }
      const projectedGrossMargin = totalAgreedRevenue - totalEstimatedCost;
      const marginPercentage = totalAgreedRevenue > 0 ? ((projectedGrossMargin / totalAgreedRevenue) * 100).toFixed(1) : 0;

      return res.json({
        metrics: {
          paymentsAwaitingVerificationCount: awaitingVerification.length,
          unpaidInvoicesCount: unpaidInvoices.length,
          overdueInvoicesCount: overdueInvoices.length,
          totalInvoiced,
          amountCollected,
          outstandingReceivables,
          refundsPendingCalculationCount: refundsPendingCalculation.length,
          refundsPendingExecutionCount: refundsPendingExecution.length,
          refundsCompletedCount: refundsCompleted.length,
          totalEstimatedCost,
          totalAgreedRevenue,
          projectedGrossMargin,
          marginPercentage
        },
        awaitingVerification,
        overdueInvoices
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Prepare or Update Financial Trip Cost Report
  async saveFinancialReport(req, res) {
    try {
      const {
        tripRequestId,
        agreedCustomerPrice,
        costBreakdown = [], // Array of { category, estimatedCost, confirmedCost }
        clearedByFinance = true
      } = req.body;

      if (!tripRequestId || !agreedCustomerPrice) {
        return res.status(400).json({ error: 'Trip request ID and agreed customer price are required.' });
      }

      const request = store.findById('tripRequests', tripRequestId);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const totalEstimated = costBreakdown.reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0);
      const projectedMargin = agreedCustomerPrice - totalEstimated;
      const marginPercentage = agreedCustomerPrice > 0 ? ((projectedMargin / agreedCustomerPrice) * 100).toFixed(1) : 0;

      let report = store.findOne('financialReports', f => f.tripRequestId === request.tripRequestId);
      if (report) {
        store.updateById('financialReports', report.id, {
          agreedCustomerPrice: Number(agreedCustomerPrice),
          estimatedSupplierExpense: totalEstimated,
          projectedMargin,
          marginPercentage: parseFloat(marginPercentage),
          costBreakdown,
          clearedByFinance,
          clearedAt: clearedByFinance ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        });
      } else {
        report = {
          id: uuidv4(),
          tripRequestId: request.tripRequestId,
          agreedCustomerPrice: Number(agreedCustomerPrice),
          estimatedSupplierExpense: totalEstimated,
          projectedMargin,
          marginPercentage: parseFloat(marginPercentage),
          costBreakdown,
          clearedByFinance,
          clearedAt: clearedByFinance ? new Date().toISOString() : null,
          createdAt: new Date().toISOString()
        };
        store.insert('financialReports', report);
      }

      // If Finance marks clearance, update trip request status to FINANCE_REVIEW / PAYMENT_PENDING
      if (clearedByFinance && request.status === 'SUBMITTED') {
        store.updateById('tripRequests', request.id, { status: 'PAYMENT_PENDING' });
      }

      logAudit(req, 'FINANCIAL_COST_REPORT_SAVED', 'TRIP_REQUEST', request.tripRequestId, {
        totalEstimated,
        projectedMargin
      });

      return res.json({ message: 'Financial cost report saved successfully.', report });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Issue Invoice / Payment Request
  async createInvoice(req, res) {
    try {
      const { tripRequestId, dueDate, taxPercentage = 5, itemizedNotes } = req.body;

      const request = store.findById('tripRequests', tripRequestId);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const invoiceId = generateId('INV');
      const baseAmount = Number(request.agreedAmount);
      const taxes = (baseAmount * (taxPercentage / 100));
      const totalAmount = baseAmount; // Typically price is inclusive or tax added per business rule

      const calculatedDueDate = dueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

      const newInvoice = {
        id: uuidv4(),
        invoiceId,
        tripRequestId: request.tripRequestId,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        customerEmail: request.customerEmail,
        packageName: request.packageName,
        travelDates: request.travelDates,
        travellerCount: request.travellerCount,
        baseAmount,
        taxPercentage,
        taxes,
        totalAmount,
        amountReceived: 0,
        balanceDue: totalAmount,
        dueDate: calculatedDueDate,
        status: 'UNPAID',
        upiId: config.upi.id,
        upiName: config.upi.name,
        itemizedNotes: itemizedNotes || `Comprehensive booking charges for ${request.packageName} (${request.travellerCount} travellers)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.insert('invoices', newInvoice);

      // Move trip request status to PAYMENT_PENDING
      store.updateById('tripRequests', request.id, { status: 'PAYMENT_PENDING' });

      // Notify Sales
      notify({
        recipientDept: 'SALES',
        title: 'Payment Request Generated',
        message: `Invoice ${invoiceId} generated for ${request.customerName} (₹${totalAmount.toLocaleString()}). Due: ${calculatedDueDate}`,
        category: 'FINANCE',
        linkedType: 'INVOICE',
        linkedId: invoiceId
      });

      logAudit(req, 'INVOICE_GENERATED', 'INVOICE', invoiceId, {
        tripRequestId: request.tripRequestId,
        totalAmount,
        dueDate: calculatedDueDate
      });

      return res.status(201).json(newInvoice);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. List Invoices
  async listInvoices(req, res) {
    try {
      const invoices = store.get('invoices');
      invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(invoices);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Get Invoice Details with QR Pay payload
  async getInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = store.findById('invoices', id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found.' });
      }

      const upiPayUrl = `upi://pay?pa=${encodeURIComponent(config.upi.id)}&pn=${encodeURIComponent(config.upi.name)}&am=${invoice.balanceDue}&cu=INR&tn=${encodeURIComponent(`MM Trip ${invoice.tripRequestId}`)}`;

      const payments = store.find('payments', p => p.invoiceId === invoice.invoiceId);
      const settings = store.data.systemSettings;

      return res.json({
        invoice,
        payments,
        company: {
          name: settings.companyName,
          gstNumber: settings.gstNumber,
          address: settings.registeredAddress,
          supportEmail: settings.supportEmail,
          supportPhone: settings.supportPhone
        },
        upi: {
          upiId: config.upi.id,
          upiName: config.upi.name,
          qrPayload: upiPayUrl
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
