import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const approvalController = {
  // 1. List items awaiting Master approval
  async listPendingApprovals(req, res) {
    try {
      const tripRequests = store.find('tripRequests', r =>
        r.status === 'MASTER_REVIEW' ||
        r.status === 'SUBMITTED' ||
        r.status === 'CANCEL_REQUESTED'
      );

      const refundRequests = store.find('refundRequests', r => r.status === 'PENDING_MASTER_APPROVAL');
      const pendingEmployees = store.find('users', u => u.status === 'PENDING_MASTER_APPROVAL');

      // Enrich trip requests with financial and payment info
      const enrichedTripRequests = tripRequests.map(tr => {
        const invoices = store.find('invoices', i => i.tripRequestId === tr.tripRequestId);
        const payments = store.find('payments', p => p.tripRequestId === tr.tripRequestId && p.status === 'VERIFIED');
        const financialReport = store.findOne('financialReports', f => f.tripRequestId === tr.tripRequestId);
        const travellers = store.find('travellers', t => t.tripRequestId === tr.tripRequestId);

        return {
          ...tr,
          invoices,
          verifiedPaymentsTotal: payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
          financialReport,
          travellersCount: travellers.length
        };
      });

      return res.json({
        tripRequests: enrichedTripRequests,
        refundRequests,
        pendingEmployeesCount: pendingEmployees.length
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Master Approves Trip Request (Green Signal for Supplier Booking)
  async approveTripRequest(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;

      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      // Check payment status: in the baseline workflow, payment or authorized deposit must be present
      const invoice = store.findOne('invoices', i => i.tripRequestId === request.tripRequestId);
      const isPaid = invoice && (invoice.status === 'PAID' || (request.depositAllowed && invoice.amountReceived > 0));

      const oldStatus = request.status;
      const newStatus = 'APPROVED_FOR_SUPPLIER_BOOKING';

      store.updateById('tripRequests', request.id, {
        status: newStatus,
        masterApprovedBy: req.user.empId,
        masterApprovedAt: new Date().toISOString(),
        approvalComments: comments || null
      });

      // Automatically create operational Trip record if not yet created
      let trip = store.findOne('trips', t => t.tripRequestId === request.tripRequestId);
      if (!trip) {
        const tripId = generateId('TRP');
        trip = {
          id: uuidv4(),
          tripId,
          tripRequestId: request.tripRequestId,
          customerName: request.customerName,
          customerPhone: request.customerPhone,
          customerEmail: request.customerEmail,
          packageName: request.packageName,
          travelDates: request.travelDates,
          travellerCount: request.travellerCount,
          salesEmpId: request.submittedBy,
          assignedMediaEmpIds: [],
          status: 'AWAITING_SUPPLIER_BOOKING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        store.insert('trips', trip);
      }

      // Notify Sales
      notify({
        recipientDept: 'SALES',
        title: 'Green Signal Granted: Supplier Booking Authorized',
        message: `Master has approved Trip Request ${request.tripRequestId} (${request.customerName}). Operational Trip ${trip.tripId} created. You may now book transport and accommodation.`,
        category: 'TRIP_OPERATION',
        linkedType: 'TRIP',
        linkedId: trip.tripId
      });

      logAudit(req, 'MASTER_APPROVAL_GRANTED', 'TRIP_REQUEST', request.tripRequestId, {
        oldStatus,
        newStatus,
        tripId: trip.tripId,
        comments
      });

      return res.json({
        message: 'Master approval granted. Green signal dispatched to Sales.',
        tripRequest: { ...request, status: newStatus },
        operationalTrip: trip
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Master Rejects Trip Request
  async rejectTripRequest(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'Rejection reason is required.' });
      }

      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const oldStatus = request.status;
      const newStatus = 'MASTER_REJECTED';

      store.updateById('tripRequests', request.id, {
        status: newStatus,
        masterRejectedBy: req.user.empId,
        masterRejectedAt: new Date().toISOString(),
        rejectionReason: reason
      });

      notify({
        recipientDept: 'SALES',
        title: 'Trip Request Rejected by Master',
        message: `Trip Request ${request.tripRequestId} was rejected by Master. Reason: ${reason}`,
        category: 'APPROVAL',
        linkedType: 'TRIP_REQUEST',
        linkedId: request.tripRequestId
      });

      logAudit(req, 'MASTER_REJECTION', 'TRIP_REQUEST', request.tripRequestId, {
        oldStatus,
        newStatus,
        reason
      });

      return res.json({
        message: 'Trip request rejected.',
        tripRequest: { ...request, status: newStatus, rejectionReason: reason }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Master Requests Changes from Sales
  async requestChanges(req, res) {
    try {
      const { id } = req.params;
      const { changeNotes } = req.body;

      if (!changeNotes) {
        return res.status(400).json({ error: 'Change request notes are required.' });
      }

      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const oldStatus = request.status;
      const newStatus = 'CHANGES_REQUESTED';

      store.updateById('tripRequests', request.id, {
        status: newStatus,
        changeRequestNotes: changeNotes
      });

      notify({
        recipientDept: 'SALES',
        title: 'Changes Requested on Trip Request',
        message: `Master returned Trip Request ${request.tripRequestId} for adjustments: ${changeNotes}`,
        category: 'APPROVAL',
        linkedType: 'TRIP_REQUEST',
        linkedId: request.tripRequestId
      });

      logAudit(req, 'MASTER_REQUESTED_CHANGES', 'TRIP_REQUEST', request.tripRequestId, {
        oldStatus,
        newStatus,
        changeNotes
      });

      return res.json({
        message: 'Trip request returned to Sales for modifications.',
        tripRequest: { ...request, status: newStatus, changeRequestNotes: changeNotes }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Authorize Advance Deposit Exception
  async authorizeDeposit(req, res) {
    try {
      const { id } = req.params;
      const { approved, depositAmount, dueDate, comments } = req.body;

      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      if (approved) {
        store.updateById('tripRequests', request.id, {
          depositAllowed: true,
          depositAmount: parseFloat(depositAmount) || request.agreedAmount * 0.3,
          depositDueDate: dueDate || null
        });

        notify({
          recipientDept: 'FINANCE',
          title: 'Master Authorized Advance Deposit Exception',
          message: `Master approved ₹${(parseFloat(depositAmount) || request.agreedAmount * 0.3).toLocaleString()} deposit for ${request.tripRequestId}. Issue revised invoice.`,
          category: 'FINANCE',
          linkedType: 'TRIP_REQUEST',
          linkedId: request.tripRequestId
        });
      }

      logAudit(req, 'DEPOSIT_EXCEPTION_AUTHORIZED', 'TRIP_REQUEST', request.tripRequestId, {
        approved,
        depositAmount,
        dueDate,
        comments
      });

      return res.json({ message: 'Deposit exception decision recorded.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
