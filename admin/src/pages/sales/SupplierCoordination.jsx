import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Briefcase,
  Plus,
  Hotel,
  Car,
  FileCheck,
  CheckCircle2,
  DollarSign,
  PhoneCall,
  Calendar
} from 'lucide-react';

export default function SupplierCoordination() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [feedback, setFeedback] = useState('');

  // Add Supplier Modal
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    supplierType: 'HOTEL',
    supplierName: '',
    contactPhone: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    quotedCost: '',
    confirmedCost: '',
    bookingRef: '',
    status: 'CONFIRMED'
  });

  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res || []);
      if (res && res.length > 0 && !selectedTrip) {
        selectTripDetails(res[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectTripDetails = async (trip) => {
    setSelectedTrip(trip);
    try {
      const res = await api.get(`/trips/${trip.id}`);
      setSuppliers(res.suppliers || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    try {
      await api.post(`/trips/${selectedTrip.id}/suppliers`, supplierForm);
      setFeedback('Supplier arrangement successfully recorded.');
      setShowSupplierModal(false);
      setSupplierForm({
        supplierType: 'HOTEL',
        supplierName: '',
        contactPhone: '',
        roomType: '',
        checkInDate: '',
        checkOutDate: '',
        quotedCost: '',
        confirmedCost: '',
        bookingRef: '',
        status: 'CONFIRMED'
      });
      await selectTripDetails(selectedTrip);
      await loadTrips();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
          <Briefcase className="w-4 h-4 text-brand-600" />
          Supplier Logistics & Ground Reservations
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Supplier Coordination Desk
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Sales contacts transport fleet, mountain drivers, boutique stays, and sanctuaries only after Master clearance.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Two Column Layout: Trips List + Selected Trip Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Trips cleared for booking */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Operational Trips ({trips.length})
          </h2>

          <div className="space-y-2">
            {trips.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No trips cleared for supplier booking.</div>
            ) : (
              trips.map((t) => (
                <div
                  key={t.id}
                  onClick={() => selectTripDetails(t)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    selectedTrip?.id === t.id
                      ? 'bg-brand-50 border-brand-300 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-brand-800">{t.tripId}</span>
                    <Badge status={t.status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-900">{t.customerName}</div>
                  <div className="text-[11px] text-slate-500">{t.packageName}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{t.travelDates} • {t.travellerCount} travellers</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Supplier Arrangements */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTrip ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-brand-700">{selectedTrip.tripId}</span>
                    <Badge status={selectedTrip.status} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedTrip.customerName}</h2>
                  <div className="text-xs text-slate-500">
                    {selectedTrip.packageName} ({selectedTrip.travelDates}) • {selectedTrip.travellerCount} pax
                  </div>
                </div>

                <button
                  onClick={() => setShowSupplierModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" /> Add Supplier Record
                </button>
              </div>

              {/* Suppliers List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Confirmed Supplier Bookings ({suppliers.length})
                </h3>

                {suppliers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No supplier bookings recorded yet. Click "Add Supplier Record" to log hotel quotes or transport vehicles.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suppliers.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                              {s.supplierType}
                            </span>
                            <span className="font-bold text-sm text-slate-900">{s.supplierName}</span>
                            <span className="text-xs font-semibold text-emerald-600">({s.status})</span>
                          </div>
                          {s.roomType && (
                            <div className="text-xs text-slate-600">Category: <strong>{s.roomType}</strong></div>
                          )}
                          {s.bookingRef && (
                            <div className="text-xs text-slate-500 font-mono">
                              Booking Ref: <strong>{s.bookingRef}</strong>
                            </div>
                          )}
                          {s.contactPhone && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <PhoneCall className="w-3 h-3 text-slate-400" /> {s.contactPhone}
                            </div>
                          )}
                        </div>

                        <div className="text-right whitespace-nowrap">
                          <div className="text-[10px] text-slate-400 uppercase">Confirmed Cost</div>
                          <div className="text-base font-black text-slate-900">
                            ₹{s.confirmedCost?.toLocaleString() || s.quotedCost?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              Select an operational trip to view and manage supplier arrangements.
            </div>
          )}
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <Modal isOpen={true} onClose={() => setShowSupplierModal(false)} title="Record Supplier Arrangement">
          <form onSubmit={handleAddSupplier} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Supplier Type</label>
                <select
                  value={supplierForm.supplierType}
                  onChange={(e) => setSupplierForm({ ...supplierForm, supplierType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="HOTEL">Hotel / Homestay</option>
                  <option value="TRANSPORT">Transport / 4x4 Fleet</option>
                  <option value="PERMITS">Permits & Sanctuaries</option>
                  <option value="ACTIVITY">Activity / Camping</option>
                  <option value="OTHER">Other Supplier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Supplier / Property Name</label>
                <input
                  type="text"
                  required
                  value={supplierForm.supplierName}
                  onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                  placeholder="e.g. Deyzor Hotel Kaza or Tenzin 4x4"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={supplierForm.contactPhone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPhone: e.target.value })}
                  placeholder="+91 Phone"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Room / Vehicle Details</label>
                <input
                  type="text"
                  value={supplierForm.roomType}
                  onChange={(e) => setSupplierForm({ ...supplierForm, roomType: e.target.value })}
                  placeholder="e.g. Deluxe Room x 2 or Scorpio 4WD"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Confirmed Cost (INR)</label>
                <input
                  type="number"
                  required
                  value={supplierForm.confirmedCost}
                  onChange={(e) => setSupplierForm({ ...supplierForm, confirmedCost: e.target.value })}
                  placeholder="28000"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Booking Reference ID</label>
                <input
                  type="text"
                  value={supplierForm.bookingRef}
                  onChange={(e) => setSupplierForm({ ...supplierForm, bookingRef: e.target.value })}
                  placeholder="e.g. DEY-KZ-104"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setShowSupplierModal(false)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm">
                Save Arrangement
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
