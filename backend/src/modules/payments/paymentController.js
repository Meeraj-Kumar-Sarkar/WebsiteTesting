import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const paymentController = {
  // 1. List payments
  async listPayments(req, res) {
    try {
      const { status } = req.query;
      let payments = store.get('payments');
      if (status && status !== 'ALL') {
        payments = payments.filter(p => p.status === status);
      }
      payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(payments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Submit Payment Reference (Customer reports payment via UPI / Bank)
  async submitPayment(req, res) {
    try {
      const { invoiceId, amount, method = 'UPI_QR_MANUAL', transactionRef, customerNotes } = req.body;

      if (!invoiceId || !amount || !transactionRef) {
        return res.status(400).json({ error: 'Invoice ID, amount, and transaction reference (UTR) are required.' });
      }

      const invoice = store.findById('invoices', invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found.' });
      }

      const paymentId = generateId('PAY');

      const payment = {
        id: uuidv4(),
        paymentId,
        invoiceId: invoice.invoiceId,
        tripRequestId: invoice.tripRequestId,
        amount: parseFloat(amount),
        currency: 'INR',
        method,
        transactionRef: transactionRef.trim(),
        customerNotes: customerNotes || '',
        status: 'PENDING_VERIFICATION',
        verifiedBy: null,
        verifiedAt: null,
        rejectionReason: null,
        createdAt: new Date().toISOString()
      };

      store.insert('payments', payment);

      // Move trip request to PAYMENT_UNDER_VERIFICATION
      const request = store.findById('tripRequests', invoice.tripRequestId);
      if (request) {
        store.updateById('tripRequests', request.id, {
          status: 'PAYMENT_UNDER_VERIFICATION'
        });
      }

      // Notify Finance
      notify({
        recipientDept: 'FINANCE',
        title: 'Payment Awaiting Bank Verification',
        message: `Customer reported ₹${parseFloat(amount).toLocaleString()} for ${invoice.invoiceId}. UTR: ${transactionRef}. Verify against bank records.`,
        category: 'FINANCE',
        linkedType: 'PAYMENT',
        linkedId: paymentId
      });

      logAudit(req, 'PAYMENT_SUBMITTED', 'PAYMENT', paymentId, {
        invoiceId: invoice.invoiceId,
        amount,
        transactionRef
      });

      return res.status(201).json({
        message: 'Payment reference logged. Awaiting Finance reconciliation.',
        payment
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Finance Verifies Payment
  async verifyPayment(req, res) {
    try {
      const { id } = req.params;
      const payment = store.findById('payments', id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found.' });
      }

      if (payment.status === 'VERIFIED') {
        return res.status(400).json({ error: 'This payment has already been verified.' });
      }

      const invoice = store.findById('invoices', payment.invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Associated invoice not found.' });
      }

      // Update payment
      store.updateById('payments', payment.id, {
        status: 'VERIFIED',
        verifiedBy: req.user.empId,
        verifiedAt: new Date().toISOString(),
        rejectionReason: null
      });

      // Update invoice amounts
      const newAmountReceived = (Number(invoice.amountReceived) || 0) + Number(payment.amount);
      const newBalanceDue = Math.max(0, Number(invoice.totalAmount) - newAmountReceived);
      const newInvoiceStatus = newBalanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID';

      store.updateById('invoices', invoice.id, {
        amountReceived: newAmountReceived,
        balanceDue: newBalanceDue,
        status: newInvoiceStatus
      });

      // Update Trip Request status to MASTER_REVIEW
      const request = store.findById('tripRequests', invoice.tripRequestId);
      if (request) {
        store.updateById('tripRequests', request.id, {
          status: 'MASTER_REVIEW'
        });

        // Notify Master that payment is cleared and ready for approval
        notify({
          recipientDept: 'MASTER',
          title: 'Payment Verified — Awaiting Master Approval',
          message: `Finance verified ₹${payment.amount.toLocaleString()} (UTR: ${payment.transactionRef}) for ${request.tripRequestId} (${request.customerName}). Ready for your approval.`,
          category: 'APPROVAL',
          linkedType: 'TRIP_REQUEST',
          linkedId: request.tripRequestId
        });
      }

      logAudit(req, 'PAYMENT_VERIFIED', 'PAYMENT', payment.paymentId, {
        amount: payment.amount,
        transactionRef: payment.transactionRef,
        invoiceId: invoice.invoiceId,
        newBalanceDue
      });

      return res.json({
        message: 'Payment verified successfully and reconciled with invoice.',
        payment: { ...payment, status: 'VERIFIED' },
        invoiceStatus: newInvoiceStatus
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Finance Rejects Payment
  async rejectPayment(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'Rejection reason is required.' });
      }

      const payment = store.findById('payments', id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found.' });
      }

      store.updateById('payments', payment.id, {
        status: 'REJECTED',
        verifiedBy: req.user.empId,
        verifiedAt: new Date().toISOString(),
        rejectionReason: reason
      });

      // Revert Trip Request status to PAYMENT_PENDING
      const invoice = store.findById('invoices', payment.invoiceId);
      if (invoice) {
        const request = store.findById('tripRequests', invoice.tripRequestId);
        if (request) {
          store.updateById('tripRequests', request.id, {
            status: 'PAYMENT_PENDING'
          });
        }
      }

      // Notify Sales
      notify({
        recipientDept: 'SALES',
        title: 'Payment Verification Rejected',
        message: `Finance rejected payment of ₹${payment.amount.toLocaleString()} (Ref: ${payment.transactionRef}). Reason: ${reason}`,
        category: 'FINANCE',
        linkedType: 'PAYMENT',
        linkedId: payment.paymentId
      });

      logAudit(req, 'PAYMENT_REJECTED', 'PAYMENT', payment.paymentId, {
        amount: payment.amount,
        reason
      });

      return res.json({
        message: 'Payment rejected and flagged for Sales follow-up.',
        payment: { ...payment, status: 'REJECTED', rejectionReason: reason }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
