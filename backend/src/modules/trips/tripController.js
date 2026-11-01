import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const tripController = {
  // 1. List operational trips
  async listTrips(req, res) {
    try {
      const { status } = req.query;
      let trips = store.get('trips');

      // If user is from Marketing/Media, only show trips where they are assigned (or Master sees all)
      if (req.user.departments.includes('MARKETING') && !req.user.departments.includes('MASTER') && !req.user.departments.includes('SALES')) {
        trips = trips.filter(t => t.assignedMediaEmpIds && t.assignedMediaEmpIds.includes(req.user.empId));
      }

      if (status && status !== 'ALL') {
        trips = trips.filter(t => t.status === status);
      }

      trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(trips);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Get trip details with suppliers, media, and restricted contact info
  async getTrip(req, res) {
    try {
      const { id } = req.params;
      const trip = store.findById('trips', id);
      if (!trip) {
        return res.status(404).json({ error: 'Operational trip not found.' });
      }

      // Check Marketing contact privacy rule:
      // "Only photographers/media employees assigned to a trip may access the customer contact details necessary for that trip."
      const isMedia = req.user.departments.includes('MARKETING') && !req.user.departments.includes('MASTER') && !req.user.departments.includes('SALES');
      const isAssigned = trip.assignedMediaEmpIds && trip.assignedMediaEmpIds.includes(req.user.empId);

      if (isMedia && !isAssigned) {
        return res.status(403).json({ error: 'You are not assigned to this trip.' });
      }

      const suppliers = store.find('tripSuppliers', s => s.tripId === trip.tripId);
      const mediaAssets = store.find('mediaAssets', m => m.tripId === trip.tripId);
      const travellers = store.find('travellers', t => t.tripRequestId === trip.tripRequestId);

      // Sanitize contact if not assigned media or general
      const tripData = { ...trip };
      if (isMedia && !isAssigned) {
        delete tripData.customerPhone;
        delete tripData.customerEmail;
      }

      return res.json({
        trip: tripData,
        suppliers,
        mediaAssets,
        travellers
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Add or update supplier arrangement
  async saveSupplier(req, res) {
    try {
      const { id } = req.params;
      const {
        supplierType, // 'HOTEL', 'TRANSPORT', 'PERMITS', 'ACTIVITY', 'OTHER'
        supplierName,
        contactPhone,
        roomType,
        checkInDate,
        checkOutDate,
        quotedCost,
        confirmedCost,
        bookingRef,
        status = 'CONFIRMED',
        notes
      } = req.body;

      const trip = store.findById('trips', id);
      if (!trip) {
        return res.status(404).json({ error: 'Operational trip not found.' });
      }

      const supplier = {
        id: uuidv4(),
        tripId: trip.tripId,
        supplierType: supplierType || 'HOTEL',
        supplierName: supplierName.trim(),
        contactPhone: contactPhone || null,
        roomType: roomType || null,
        checkInDate: checkInDate || null,
        checkOutDate: checkOutDate || null,
        quotedCost: parseFloat(quotedCost) || 0,
        confirmedCost: parseFloat(confirmedCost) || 0,
        bookingRef: bookingRef || null,
        status,
        notes: notes || null,
        createdAt: new Date().toISOString()
      };

      store.insert('tripSuppliers', supplier);

      // Check if all essential suppliers are confirmed and update operational trip status
      const allTripSuppliers = store.find('tripSuppliers', s => s.tripId === trip.tripId);
      const allConfirmed = allTripSuppliers.every(s => s.status === 'CONFIRMED');
      if (allConfirmed && allTripSuppliers.length >= 2) {
        store.updateById('trips', trip.id, { status: 'SUPPLIER_CONFIRMED' });
      } else {
        store.updateById('trips', trip.id, { status: 'SUPPLIER_BOOKING_IN_PROGRESS' });
      }

      logAudit(req, 'SUPPLIER_ARRANGEMENT_SAVED', 'TRIP', trip.tripId, {
        supplierName,
        supplierType,
        confirmedCost
      });

      return res.status(201).json(supplier);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Update operational trip status
  async updateTripStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowed = [
        'AWAITING_SUPPLIER_BOOKING', 'SUPPLIER_BOOKING_IN_PROGRESS',
        'SUPPLIER_PARTIALLY_CONFIRMED', 'SUPPLIER_CONFIRMED',
        'UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
      ];

      if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      }

      const trip = store.findById('trips', id);
      if (!trip) {
        return res.status(404).json({ error: 'Operational trip not found.' });
      }

      store.updateById('trips', trip.id, { status });
      logAudit(req, 'TRIP_STATUS_UPDATED', 'TRIP', trip.tripId, { oldStatus: trip.status, newStatus: status });

      return res.json({ message: 'Trip status updated.', trip: { ...trip, status } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Assign photographer / media employee
  async assignMedia(req, res) {
    try {
      const { id } = req.params;
      const { mediaEmpIds } = req.body; // Array of empIds

      if (!Array.isArray(mediaEmpIds)) {
        return res.status(400).json({ error: 'mediaEmpIds must be an array of Employee IDs.' });
      }

      const trip = store.findById('trips', id);
      if (!trip) {
        return res.status(404).json({ error: 'Operational trip not found.' });
      }

      store.updateById('trips', trip.id, {
        assignedMediaEmpIds: mediaEmpIds
      });

      for (const empId of mediaEmpIds) {
        notify({
          recipientId: empId,
          title: 'Assigned to New Trip for Media Coverage',
          message: `You have been assigned to trip ${trip.tripId} (${trip.packageName} - ${trip.travelDates}). Check your dashboard for trip workspace.`,
          category: 'MEDIA',
          linkedType: 'TRIP',
          linkedId: trip.tripId
        });
      }

      logAudit(req, 'MEDIA_EMPLOYEE_ASSIGNED', 'TRIP', trip.tripId, { mediaEmpIds });

      return res.json({ message: 'Media assignments updated successfully.', assignedMediaEmpIds: mediaEmpIds });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
