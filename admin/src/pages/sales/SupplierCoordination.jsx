import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast } from '../../context/FeedbackContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  Briefcase,
  Plus,
  Hotel,
  Car,
  FileCheck,
  CheckCircle2,
  DollarSign,
  PhoneCall,
  Calendar,
  Layers
} from 'lucide-react';

export default function SupplierCoordination() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

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

  const toast = useToast();
  const { formatDate } = usePreferences();

  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res || []);
      if (res && res.length > 0 && !selectedTrip) {
        selectTripDetails(res[0]);
      }
    } catch (e) {
      toast.error('Failed to load operational trips: ' + e.message);
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
      toast.error('Failed to load supplier details: ' + e.message);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    setActionLoading(true);
    try {
      await api.post(`/trips/${selectedTrip.id}/suppliers`, supplierForm);
      toast.success('Supplier arrangement successfully recorded.');
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
      toast.error(`Error saving supplier: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Supplier Logistics & Ground Reservations"
        title="Supplier Coordination Desk"
        description="Manage verified hotel bookings, 4x4 mountain vehicle drivers, high-altitude sanctuary permits, and supplier invoices."
        icon={Briefcase}
      />

      {/* Two Column Layout: Trips List + Selected Trip Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Operational Trips */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Operational Trips ({trips.length})
            </h2>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading && !trips.length ? (
              <div className="p-8 text-center"><Spinner className="w-6 h-6 mx-auto text-brand-600" /></div>
            ) : trips.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No trips currently cleared for supplier booking.
              </div>
            ) : (
              trips.map((t) => (
                <div
                  key={t.id}
                  onClick={() => selectTripDetails(t)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedTrip?.id === t.id
                      ? 'bg-brand-50/70 border-brand-400 shadow-soft ring-1 ring-brand-400/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-brand-800">{t.tripId}</span>
                    <Badge status={t.status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-900">{t.customerName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{t.packageName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{t.travelDates} • {t.travellerCount} pax</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Supplier Arrangements */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTrip ? (
            <div className="card p-6 space-y-6">
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
                  className="btn-primary text-xs self-start"
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
                  <EmptyState
                    icon={Briefcase}
                    title="No supplier bookings recorded yet"
                    description="Click 'Add Supplier Record' to log reserved boutique hotel rooms or private 4x4 vehicles."
                    action={
                      <button
                        onClick={() => setShowSupplierModal(true)}
                        className="btn-primary text-xs"
                      >
                        <Plus className="w-4 h-4" /> Add First Supplier Record
                      </button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {suppliers.map((s) => (
                      <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-100 text-brand-800">
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
                            <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                              <PhoneCall className="w-3 h-3 text-slate-400" /> {s.contactPhone}
                            </div>
                          )}
                        </div>

                        <div className="text-right whitespace-nowrap">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Confirmed Cost</div>
                          <div className="text-base font-black text-slate-900 tabular-nums">
                            ₹{(s.confirmedCost || s.quotedCost)?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-xs text-slate-400">
              Select an operational trip from the left panel to review and manage supplier arrangements.
            </div>
          )}
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowSupplierModal(false)}
          title="Record Supplier Arrangement"
          description={`Trip: ${selectedTrip?.tripId} • Customer: ${selectedTrip?.customerName}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowSupplierModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-supplier-form"
                disabled={actionLoading}
                className="btn-primary text-xs"
              >
                {actionLoading ? 'Recording...' : 'Save Arrangement'}
              </button>
            </>
          }
        >
          <form id="add-supplier-form" onSubmit={handleAddSupplier} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Type</label>
                <select
                  value={supplierForm.supplierType}
                  onChange={(e) => setSupplierForm({ ...supplierForm, supplierType: e.target.value })}
                  className="input text-xs"
                >
                  <option value="HOTEL">Hotel / Homestay</option>
                  <option value="TRANSPORT">Transport / 4x4 Fleet</option>
                  <option value="PERMITS">Permits &amp; Sanctuaries</option>
                  <option value="ACTIVITY">Activity / Camping</option>
                  <option value="OTHER">Other Supplier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier / Property Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={supplierForm.supplierName}
                  onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                  placeholder="e.g. Deyzor Hotel Kaza or Tenzin 4x4"
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={supplierForm.contactPhone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Vehicle Category</label>
                <input
                  type="text"
                  value={supplierForm.roomType}
                  onChange={(e) => setSupplierForm({ ...supplierForm, roomType: e.target.value })}
                  placeholder="e.g. Deluxe Mud Cottage or Toyota Fortuner 4WD"
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmed Cost (INR)</label>
                <input
                  type="number"
                  value={supplierForm.confirmedCost}
                  onChange={(e) => setSupplierForm({ ...supplierForm, confirmedCost: e.target.value })}
                  placeholder="34000"
                  className="input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Booking Reference</label>
                <input
                  type="text"
                  value={supplierForm.bookingRef}
                  onChange={(e) => setSupplierForm({ ...supplierForm, bookingRef: e.target.value })}
                  placeholder="e.g. DEY-44819"
                  className="input text-xs font-mono"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
