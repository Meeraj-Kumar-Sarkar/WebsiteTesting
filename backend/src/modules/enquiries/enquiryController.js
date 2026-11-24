import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const enquiryController = {
  // 1. List enquiries with search, filtering, and duplicate markers
  async listEnquiries(req, res) {
    try {
      const { status, source, search, includeArchived } = req.query;
      let enquiries = [...store.get('enquiries')];

      if (includeArchived !== 'true') {
        enquiries = enquiries.filter(e => !e.isArchived);
      }

      if (status && status !== 'ALL') {
        enquiries = enquiries.filter(e => e.status === status);
      }

      if (source && source !== 'ALL') {
        enquiries = enquiries.filter(e => e.source === source);
      }

      if (search) {
        const q = search.toLowerCase();
        enquiries = enquiries.filter(e =>
          e.enquiryId?.toLowerCase().includes(q) ||
          e.customerName?.toLowerCase().includes(q) ||
          e.phone?.includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.selectedPackage?.toLowerCase().includes(q)
        );
      }

      enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json(enquiries);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Ingest Enquiry (Used by Website forms or Sales entry)
  async createEnquiry(req, res) {
    try {
      const {
        source = 'WEBSITE',
        customerName,
        name,
        phone,
        whatsappNumber,
        email,
        selectedPackage,
        destination,
        subject,
        travelDates,
        travellerCount,
        travellers,
        message,
        notes
      } = req.body;

      const resolvedName = (customerName || name || '').trim();
      const resolvedPhone = (phone || '').trim();

      if (!resolvedName || !resolvedPhone) {
        return res.status(400).json({ error: 'Customer name and phone number are required.' });
      }

      const enquiryId = generateId('ENQ');

      // Parse traveller count if passed as string like "2 Adults" or "3-4 People"
      let parsedTravellers = parseInt(travellerCount, 10);
      if (isNaN(parsedTravellers) && typeof travellers === 'string') {
        const match = travellers.match(/\d+/);
        parsedTravellers = match ? parseInt(match[0], 10) : 1;
      } else if (isNaN(parsedTravellers) && typeof travellers === 'number') {
        parsedTravellers = travellers;
      }
      if (!parsedTravellers || parsedTravellers < 1) {
        parsedTravellers = 1;
      }

      // Duplicate Detection Algorithm
      const existing = store.find('enquiries', e => !e.isArchived);
      const cleanPhone1 = resolvedPhone.replace(/\D/g, '');
      const matchedDuplicate = existing.find(e => {
        if (e.status === 'CLOSED' || e.status === 'REJECTED') return false;
        const cleanPhone2 = e.phone ? e.phone.replace(/\D/g, '') : '';
        const samePhone = cleanPhone1.length >= 8 && cleanPhone2.length >= 8 && cleanPhone1.slice(-10) === cleanPhone2.slice(-10);
        const sameEmail = email && e.email && email.trim().toLowerCase() === e.email.trim().toLowerCase();
        return samePhone || sameEmail;
      });

      const resolvedPackage = selectedPackage || destination || subject || 'Custom Himalayan Inquiry';
      const resolvedMessage = message || notes || '';

      const newEnquiry = {
        id: uuidv4(),
        enquiryId,
        source: String(source).toUpperCase(),
        customerName: resolvedName,
        phone: resolvedPhone,
        whatsappNumber: whatsappNumber ? whatsappNumber.trim() : resolvedPhone,
        email: email ? email.trim().toLowerCase() : null,
        selectedPackage: resolvedPackage,
        travelDates: travelDates || 'Flexible / TBD',
        travellerCount: parsedTravellers,
        message: resolvedMessage,
        status: 'NEW',
        isDuplicate: Boolean(matchedDuplicate),
        duplicateOfEnquiryId: matchedDuplicate ? matchedDuplicate.enquiryId : null,
        isArchived: false,
        createdBy: req.user ? req.user.empId : 'WEBSITE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.insert('enquiries', newEnquiry);

      // Notification to Sales
      notify({
        recipientDept: 'SALES',
        title: matchedDuplicate ? 'Duplicate Enquiry Detected' : 'New Travel Enquiry Received',
        message: `${resolvedName} enquired for ${newEnquiry.selectedPackage} (${newEnquiry.travelDates}). Phone: ${resolvedPhone}`,
        category: 'ENQUIRY',
        linkedType: 'ENQUIRY',
        linkedId: enquiryId
      });

      logAudit(req, 'ENQUIRY_CREATED', 'ENQUIRY', enquiryId, {
        source: newEnquiry.source,
        customerName: resolvedName,
        selectedPackage: resolvedPackage,
        isDuplicate: newEnquiry.isDuplicate
      });

      return res.status(201).json({
        message: 'Enquiry received successfully.',
        enquiry: newEnquiry
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Get single enquiry with notes
  async getEnquiry(req, res) {
    try {
      const { id } = req.params;
      const enquiry = store.findById('enquiries', id);
      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const notes = store.find('enquiryNotes', n => n.enquiryId === enquiry.enquiryId);
      notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({ enquiry, notes });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Update status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowed = [
        'NEW', 'CONTACTED', 'INTERESTED', 'NEGOTIATION',
        'CUSTOMER_ACCEPTED_QUOTE', 'DETAILS_PENDING',
        'SUBMITTED_FOR_REVIEW', 'CONVERTED_TO_TRIP_REQUEST',
        'REJECTED', 'CLOSED'
      ];

      if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      }

      const enquiry = store.findById('enquiries', id);
      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const oldStatus = enquiry.status;
      store.updateById('enquiries', enquiry.id, { status });

      logAudit(req, 'ENQUIRY_STATUS_CHANGED', 'ENQUIRY', enquiry.enquiryId, { oldStatus, newStatus: status });

      return res.json({ message: 'Enquiry status updated.', enquiry: { ...enquiry, status } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Add follow-up note
  async addNote(req, res) {
    try {
      const { id } = req.params;
      const { contactMethod, notes, followUpDate } = req.body;

      if (!notes) {
        return res.status(400).json({ error: 'Follow-up notes cannot be empty.' });
      }

      const enquiry = store.findById('enquiries', id);
      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const noteEntry = {
        id: uuidv4(),
        enquiryId: enquiry.enquiryId,
        authorEmpId: req.user ? req.user.empId : 'SYS',
        authorName: req.user ? req.user.fullName : 'System',
        contactMethod: contactMethod || 'PHONE_CALL',
        notes,
        followUpDate: followUpDate || null,
        createdAt: new Date().toISOString()
      };

      store.insert('enquiryNotes', noteEntry);
      logAudit(req, 'ENQUIRY_NOTE_ADDED', 'ENQUIRY', enquiry.enquiryId, { contactMethod });

      return res.status(201).json(noteEntry);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 6. Merge Duplicate Enquiries
  async mergeEnquiry(req, res) {
    try {
      const { id } = req.params;
      const { targetEnquiryId, mergeNotes } = req.body;

      const sourceEnquiry = store.findById('enquiries', id);
      const targetEnquiry = store.findById('enquiries', targetEnquiryId);

      if (!sourceEnquiry || !targetEnquiry) {
        return res.status(404).json({ error: 'Source or target enquiry not found.' });
      }

      store.updateById('enquiries', sourceEnquiry.id, {
        status: 'CLOSED',
        isArchived: true,
        mergedInto: targetEnquiry.enquiryId
      });

      const notes = store.find('enquiryNotes', n => n.enquiryId === sourceEnquiry.enquiryId);
      for (const n of notes) {
        store.insert('enquiryNotes', {
          ...n,
          id: uuidv4(),
          enquiryId: targetEnquiry.enquiryId,
          notes: `[Merged from ${sourceEnquiry.enquiryId}]: ${n.notes}`
        });
      }

      store.insert('enquiryNotes', {
        id: uuidv4(),
        enquiryId: targetEnquiry.enquiryId,
        authorEmpId: req.user.empId,
        authorName: req.user.fullName,
        contactMethod: 'INTERNAL_MERGE',
        notes: `Merged duplicate enquiry ${sourceEnquiry.enquiryId} into this record. ${mergeNotes || ''}`,
        createdAt: new Date().toISOString()
      });

      logAudit(req, 'ENQUIRY_MERGED', 'ENQUIRY', sourceEnquiry.enquiryId, {
        targetEnquiryId: targetEnquiry.enquiryId,
        mergeNotes
      });

      return res.json({ message: `Successfully merged ${sourceEnquiry.enquiryId} into ${targetEnquiry.enquiryId}.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 7. Archive Enquiry
  async archiveEnquiry(req, res) {
    try {
      const { id } = req.params;
      const enquiry = store.findById('enquiries', id);
      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      store.updateById('enquiries', enquiry.id, { isArchived: true });
      logAudit(req, 'ENQUIRY_ARCHIVED', 'ENQUIRY', enquiry.enquiryId);

      return res.json({ message: 'Enquiry archived successfully.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
