import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import {
  FileText,
  UserCheck,
  CalendarCheck,
  Briefcase,
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function SalesDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [enqRes, reqRes, tripRes] = await Promise.all([
          api.get('/enquiries'),
          api.get('/trip-requests'),
          api.get('/trips')
        ]);
        setEnquiries(enqRes || []);
        setTripRequests(reqRes || []);
        setTrips(tripRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const newEnquiries = enquiries.filter(e => e.status === 'NEW');
  const inNegotiation = enquiries.filter(e => e.status === 'NEGOTIATION' || e.status === 'CONTACTED');
  const acceptedQuotes = enquiries.filter(e => e.status === 'CUSTOMER_ACCEPTED_QUOTE');
  const needsChanges = tripRequests.filter(r => r.status === 'CHANGES_REQUESTED');
  const approvedForSuppliers = tripRequests.filter(r => r.status === 'APPROVED_FOR_SUPPLIER_BOOKING');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-700 font-bold mb-1">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Sales & Operations Workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Sales Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer interactions, quotations, traveller dossiers, and supplier bookings after clearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/sales/enquiries"
            className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Call / Enquiry
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Enquiries"
          value={newEnquiries.length}
          subtitle="Awaiting first response from Sales"
          icon={FileText}
          color="blue"
          badgeText={newEnquiries.length > 0 ? 'Pending Contact' : 'Up to Date'}
        />

        <StatCard
          title="Active Negotiations"
          value={inNegotiation.length}
          subtitle="Quotations and itinerary shaping"
          icon={PhoneCall}
          color="purple"
        />

        <StatCard
          title="Accepted Quotes"
          value={acceptedQuotes.length}
          subtitle="Ready to collect traveller details"
          icon={CheckCircle2}
          color="emerald"
          badgeText={acceptedQuotes.length > 0 ? 'Create Trip Request' : 'None'}
        />

        <StatCard
          title="Green Signal Clearance"
          value={approvedForSuppliers.length}
          subtitle="Ready for hotel & transport booking"
          icon={Briefcase}
          color="amber"
          badgeText={approvedForSuppliers.length > 0 ? 'Book Suppliers' : 'None'}
        />
      </div>

      {/* Changes Requested Banner */}
      {needsChanges.length > 0 && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Attention: Master Requested Changes on {needsChanges.length} Trip Request(s)
          </div>
          <div className="divide-y divide-orange-100">
            {needsChanges.map(r => (
              <div key={r.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold">{r.tripRequestId}</span> ({r.customerName}) —{' '}
                  <span className="italic">{r.changeRequestNotes}</span>
                </div>
                <Link
                  to="/sales/trip-requests"
                  className="px-2.5 py-1 rounded bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700"
                >
                  Edit & Resubmit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column: Ready for Supplier Booking vs Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approved for Supplier Booking */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Green Signal: Ready for Supplier Booking ({approvedForSuppliers.length})
              </h3>
            </div>
            <Link to="/sales/suppliers" className="text-xs text-brand-600 font-semibold hover:underline">
              Supplier Desk
            </Link>
          </div>

          {approvedForSuppliers.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No trip requests currently awaiting supplier confirmation.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {approvedForSuppliers.map(req => (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-xs text-brand-700">{req.tripRequestId}</div>
                    <div className="font-semibold text-xs text-slate-900">{req.customerName} ({req.packageName})</div>
                    <div className="text-[11px] text-slate-500">{req.travelDates} • {req.travellerCount} pax</div>
                  </div>
                  <Link
                    to="/sales/suppliers"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
                  >
                    Arrange Suppliers
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Customer Enquiries */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Latest Customer Enquiries
              </h3>
            </div>
            <Link to="/sales/enquiries" className="text-xs text-brand-600 font-semibold hover:underline">
              View All Pipeline
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {enquiries.slice(0, 5).map(e => (
              <div key={e.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">{e.enquiryId}</span>
                    <Badge status={e.status} size="sm" />
                    {e.isDuplicate && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                        Duplicate
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-slate-900 mt-0.5">{e.customerName}</div>
                  <div className="text-[11px] text-slate-500">{e.selectedPackage} • {e.phone}</div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(e.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
