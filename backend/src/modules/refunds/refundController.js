import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { config } from '../../config/index.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const refundController = {
  // 1. List refunds
  async listRefunds(req, res) {
    try {
      const refunds = store.get('refundRequests');
      refunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(refunds);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Sales records cancellation request
  async requestCancellation(req, res) {
    try {
      const { tripRequestId, customerReason, requestedByCustomerDate } = req.body;

      const request = store.findById('tripRequests', tripRequestId);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const invoice = store.findOne('invoices', i => i.tripRequestId === request.tripRequestId);
      const amountPaid = invoice ? (Number(invoice.amountReceived) || 0) : 0;

      const refundId = generateId('REF');

      const refundRequest = {
        id: uuidv4(),
        refundId,
        tripRequestId: request.tripRequestId,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        customerEmail: request.customerEmail,
        travelDates: request.travelDates,
        agreedBookingAmount: request.agreedAmount,
        amountPaid,
        customerReason: customerReason || 'Customer requested trip cancellation',
        cancellationRequestedAt: requestedByCustomerDate || new Date().toISOString(),
        status: 'PENDING_MASTER_APPROVAL',
        policyVersion: config.refundPolicy.version,
        calculatedPercentage: null,
        calculatedRefundAmount: 0,
        masterApprovedBy: null,
        masterApprovedAt: null,
        refundExecutedBy: null,
        refundExecutedAt: null,
        refundTransactionRef: null,
        notes: null,
        createdAt: new Date().toISOString()
      };

      store.insert('refundRequests', refundRequest);

      // Move trip request to CANCEL_REQUESTED
      store.updateById('tripRequests', request.id, {
        status: 'CANCEL_REQUESTED'
      });

      // Also update linked trip if exists
      const trip = store.findOne('trips', t => t.tripRequestId === request.tripRequestId);
      if (trip) {
        store.updateById('trips', trip.id, { status: 'CANCELLED' });
      }

      notify({
        recipientDept: 'MASTER',
        title: 'Trip Cancellation & Refund Authorization Required',
        message: `Cancellation requested for ${request.tripRequestId} (${request.customerName}). Reason: ${customerReason}. Master authorization required before Finance processes refund.`,
        category: 'APPROVAL',
        linkedType: 'REFUND',
        linkedId: refundId
      });

      logAudit(req, 'CANCELLATION_REQUESTED', 'REFUND', refundId, {
        tripRequestId: request.tripRequestId,
        amountPaid,
        reason: customerReason
      });

      return res.status(201).json(refundRequest);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Master Authorizes Cancellation and Refund
  async approveCancellation(req, res) {
    try {
      const { id } = req.params;
      const { approved, comments } = req.body;

      const refund = store.findById('refundRequests', id);
      if (!refund) {
        return res.status(404).json({ error: 'Refund record not found.' });
      }

      if (approved) {
        store.updateById('refundRequests', refund.id, {
          status: 'PENDING_CALCULATION',
          masterApprovedBy: req.user.empId,
          masterApprovedAt: new Date().toISOString(),
          notes: comments || 'Cancellation approved by Master.'
        });

        // Mark trip request as CANCELLED
        store.update('tripRequests', r => r.tripRequestId === refund.tripRequestId, {
          status: 'CANCELLED'
        });

        notify({
          recipientDept: 'FINANCE',
          title: 'Master Approved Cancellation — Calculate Refund',
          message: `Master approved cancellation for ${refund.tripRequestId} (${refund.customerName}). Please calculate refund as per policy schedule.`,
          category: 'FINANCE',
          linkedType: 'REFUND',
          linkedId: refund.refundId
        });
      } else {
        store.updateById('refundRequests', refund.id, {
          status: 'REJECTED_BY_MASTER',
          notes: comments || 'Cancellation rejected by Master.'
        });
      }

      logAudit(req, 'CANCELLATION_DECISION_RECORDED', 'REFUND', refund.refundId, { approved, comments });

      return res.json({ message: 'Master cancellation decision recorded.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Finance Calculates Refund
  async calculateRefund(req, res) {
    try {
      const { id } = req.params;
      const { daysBeforeTrip, manualPercentage, notes } = req.body;

      const refund = store.findById('refundRequests', id);
      if (!refund) {
        return res.status(404).json({ error: 'Refund record not found.' });
      }

      let percentage = 50; // default provisional
      if (manualPercentage !== undefined && manualPercentage !== null) {
        percentage = parseFloat(manualPercentage);
      } else if (daysBeforeTrip !== undefined) {
        const d = parseInt(daysBeforeTrip, 10);
        if (d >= 7) percentage = 90;
        else if (d >= 3) percentage = 50;
        else percentage = 15;
      }

      const calculatedRefundAmount = (Number(refund.amountPaid) * (percentage / 100));

      store.updateById('refundRequests', refund.id, {
        status: 'APPROVED_PENDING_EXECUTION',
        calculatedPercentage: percentage,
        calculatedRefundAmount,
        notes: notes || `Calculated at ${percentage}% of amount paid (₹${refund.amountPaid.toLocaleString()})`
      });

      logAudit(req, 'REFUND_CALCULATED', 'REFUND', refund.refundId, {
        percentage,
        calculatedRefundAmount
      });

      return res.json({
        message: 'Refund calculated successfully.',
        refund: { ...refund, status: 'APPROVED_PENDING_EXECUTION', calculatedPercentage: percentage, calculatedRefundAmount }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Finance Executes Refund (Records transaction reference)
  async executeRefund(req, res) {
    try {
      const { id } = req.params;
      const { transactionRef, payoutMethod = 'BANK_TRANSFER' } = req.body;

      if (!transactionRef) {
        return res.status(400).json({ error: 'Bank transfer / refund transaction reference (UTR) is required.' });
      }

      const refund = store.findById('refundRequests', id);
      if (!refund) {
        return res.status(404).json({ error: 'Refund record not found.' });
      }

      store.updateById('refundRequests', refund.id, {
        status: 'COMPLETED',
        refundExecutedBy: req.user.empId,
        refundExecutedAt: new Date().toISOString(),
        refundTransactionRef: transactionRef.trim(),
        payoutMethod
      });

      notify({
        recipientDept: 'SALES',
        title: 'Refund Processed & Completed',
        message: `Finance returned ₹${refund.calculatedRefundAmount.toLocaleString()} to ${refund.customerName}. UTR: ${transactionRef}`,
        category: 'FINANCE',
        linkedType: 'REFUND',
        linkedId: refund.refundId
      });

      logAudit(req, 'REFUND_EXECUTED', 'REFUND', refund.refundId, {
        amount: refund.calculatedRefundAmount,
        transactionRef
      });

      return res.json({
        message: 'Refund payout recorded and reconciled.',
        refund: { ...refund, status: 'COMPLETED', refundTransactionRef: transactionRef }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
