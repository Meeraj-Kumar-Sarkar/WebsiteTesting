import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const tripRequestController = {
  // 1. List trip requests with filtering
  async listTripRequests(req, res) {
    try {
      const { status, search } = req.query;
      let requests = store.get('tripRequests');

      if (status && status !== 'ALL') {
        requests = requests.filter(r => r.status === status);
      }

      if (search) {
        const q = search.toLowerCase();
        requests = requests.filter(r =>
          r.tripRequestId?.toLowerCase().includes(q) ||
          r.customerName?.toLowerCase().includes(q) ||
          r.packageName?.toLowerCase().includes(q) ||
          r.customerPhone?.includes(q)
        );
      }

      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(requests);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Create Draft Trip Request
  async createTripRequest(req, res) {
    try {
      const {
        enquiryId,
        customerName,
        customerPhone,
        customerEmail,
        packageName,
        travelDates,
        travellerCount = 1,
        agreedAmount,
        currency = 'INR',
        salesNotes,
        customerRequirements,
        travellers = []
      } = req.body;

      if (!customerName || !customerPhone || !agreedAmount) {
        return res.status(400).json({ error: 'Customer name, phone number, and agreed amount are required.' });
      }

      const tripRequestId = generateId('REQ');

      const newRequest = {
        id: uuidv4(),
        tripRequestId,
        enquiryId: enquiryId || null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : null,
        packageName: packageName || 'Custom Itinerary',
        travelDates: travelDates || 'TBD',
        travellerCount: parseInt(travellerCount, 10) || travellers.length || 1,
        agreedAmount: parseFloat(agreedAmount),
        currency: currency.toUpperCase(),
        salesNotes: salesNotes || '',
        customerRequirements: customerRequirements || '',
        status: 'DRAFT',
        depositAllowed: false,
        depositAmount: 0,
        depositDueDate: null,
        submittedBy: req.user.empId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.insert('tripRequests', newRequest);

      // Save travellers if supplied
      if (Array.isArray(travellers) && travellers.length > 0) {
        for (const t of travellers) {
          store.insert('travellers', {
            id: uuidv4(),
            tripRequestId,
            fullName: t.fullName,
            age: t.age ? parseInt(t.age, 10) : null,
            dob: t.dob || null,
            gender: t.gender || null,
            phone: t.phone || null,
            email: t.email || null,
            emergencyContact: t.emergencyContact || null,
            relationship: t.relationship || 'Traveller',
            specialNotes: t.specialNotes || null,
            createdAt: new Date().toISOString()
          });
        }
      }

      // If linked to enquiry, update enquiry status
      if (enquiryId) {
        store.update('enquiries', e => e.enquiryId === enquiryId, {
          status: 'CONVERTED_TO_TRIP_REQUEST'
        });
      }

      logAudit(req, 'TRIP_REQUEST_DRAFTED', 'TRIP_REQUEST', tripRequestId, { agreedAmount });

      return res.status(201).json(newRequest);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Get single trip request with travellers and finance reports
  async getTripRequest(req, res) {
    try {
      const { id } = req.params;
      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const travellers = store.find('travellers', t => t.tripRequestId === request.tripRequestId);
      const invoices = store.find('invoices', i => i.tripRequestId === request.tripRequestId);
      const payments = store.find('payments', p => p.tripRequestId === request.tripRequestId);
      const financialReport = store.findOne('financialReports', f => f.tripRequestId === request.tripRequestId);
      const auditTrail = store.find('auditLogs', a => a.entityId === request.tripRequestId);

      return res.json({
        tripRequest: request,
        travellers,
        invoices,
        payments,
        financialReport,
        auditTrail
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Update / Save Travellers
  async saveTravellers(req, res) {
    try {
      const { id } = req.params;
      const { travellers } = req.body;

      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      if (!Array.isArray(travellers)) {
        return res.status(400).json({ error: 'Travellers must be an array.' });
      }

      // Replace travellers for this trip request
      store.delete('travellers', t => t.tripRequestId === request.tripRequestId);

      for (const t of travellers) {
        store.insert('travellers', {
          id: uuidv4(),
          tripRequestId: request.tripRequestId,
          fullName: t.fullName,
          age: t.age ? parseInt(t.age, 10) : null,
          dob: t.dob || null,
          gender: t.gender || null,
          phone: t.phone || null,
          email: t.email || null,
          emergencyContact: t.emergencyContact || null,
          relationship: t.relationship || 'Traveller',
          specialNotes: t.specialNotes || null,
          createdAt: new Date().toISOString()
        });
      }

      store.updateById('tripRequests', request.id, {
        travellerCount: travellers.length
      });

      logAudit(req, 'TRAVELLERS_UPDATED', 'TRIP_REQUEST', request.tripRequestId, { count: travellers.length });

      return res.json({ message: 'Traveller details updated successfully.', count: travellers.length });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Submit Trip Request to Finance and Master
  async submitTripRequest(req, res) {
    try {
      const { id } = req.params;
      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      const travellers = store.find('travellers', t => t.tripRequestId === request.tripRequestId);
      if (travellers.length === 0) {
        return res.status(400).json({ error: 'Cannot submit trip request without at least one traveller record.' });
      }

      const oldStatus = request.status;
      const newStatus = 'SUBMITTED';

      store.updateById('tripRequests', request.id, {
        status: newStatus,
        submittedAt: new Date().toISOString(),
        submittedBy: req.user.empId
      });

      // Notify Finance & Master
      notify({
        recipientDept: 'FINANCE',
        title: 'New Trip Request Submitted for Financial Assessment',
        message: `Trip Request ${request.tripRequestId} (${request.customerName} - ₹${request.agreedAmount.toLocaleString()}) submitted. Issue invoice and verify feasibility.`,
        category: 'FINANCE',
        linkedType: 'TRIP_REQUEST',
        linkedId: request.tripRequestId
      });

      notify({
        recipientDept: 'MASTER',
        title: 'Trip Request Submitted for Review',
        message: `Trip Request ${request.tripRequestId} (${request.customerName}) submitted for Finance & Master review pipeline.`,
        category: 'APPROVAL',
        linkedType: 'TRIP_REQUEST',
        linkedId: request.tripRequestId
      });

      logAudit(req, 'TRIP_REQUEST_SUBMITTED', 'TRIP_REQUEST', request.tripRequestId, {
        oldStatus,
        newStatus,
        agreedAmount: request.agreedAmount
      });

      return res.json({
        message: 'Trip request successfully submitted to Finance and Master queues.',
        tripRequest: { ...request, status: newStatus }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 6. Request Deposit / Advance Exception
  async requestDepositException(req, res) {
    try {
      const { id } = req.params;
      const { depositAmount, dueDate, reason } = req.body;

      const request = store.findById('tripRequests', id);
      if (!request) {
        return res.status(404).json({ error: 'Trip request not found.' });
      }

      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        return res.status(400).json({ error: 'Valid deposit amount is required.' });
      }

      notify({
        recipientDept: 'MASTER',
        title: 'Advance Deposit Exception Requested',
        message: `Sales (${req.user.fullName}) requested advance deposit exception for ${request.tripRequestId}: ₹${parseFloat(depositAmount).toLocaleString()} by ${dueDate || 'TBD'}. Reason: ${reason || 'N/A'}`,
        category: 'APPROVAL',
        linkedType: 'TRIP_REQUEST',
        linkedId: request.tripRequestId
      });

      logAudit(req, 'DEPOSIT_EXCEPTION_REQUESTED', 'TRIP_REQUEST', request.tripRequestId, {
        depositAmount,
        dueDate,
        reason
      });

      return res.json({ message: 'Advance deposit request forwarded to Master for authorization.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
