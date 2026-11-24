import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/Loaders';
import { usePreferences } from '../../context/PreferencesContext';
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
  const { formatDate } = usePreferences();

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

  if (loading && !enquiries.length) {
    return <PageLoader />;
  }

  const newEnquiries = enquiries.filter((e) => e.status === 'NEW');
  const inNegotiation = enquiries.filter((e) => e.status === 'NEGOTIATION' || e.status === 'CONTACTED');
  const acceptedQuotes = enquiries.filter((e) => e.status === 'CUSTOMER_ACCEPTED_QUOTE');
  const needsChanges = tripRequests.filter((r) => r.status === 'CHANGES_REQUESTED');
  const approvedForSuppliers = tripRequests.filter((r) => r.status === 'APPROVED_FOR_SUPPLIER_BOOKING');

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Sales & Operations Workspace"
        title="Sales Dashboard"
        description="Customer interactions, quotations, traveller dossiers, and supplier bookings after clearance."
        icon={UserCheck}
        actions={
          <Link
            to="/sales/enquiries"
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Log Call / Enquiry
          </Link>
        }
      />

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
          badgeText={acceptedQuotes.length > 0 ? 'Create Request' : 'None'}
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
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Attention: Master Requested Changes on {needsChanges.length} Trip Request(s)
          </div>
          <div className="divide-y divide-orange-100">
            {needsChanges.map((r) => (
              <div key={r.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold">{r.tripRequestId}</span> ({r.customerName}) —{' '}
                  <span className="italic">{r.changeRequestNotes}</span>
                </div>
                <Link
                  to="/sales/trip-requests"
                  className="btn-primary py-1 px-3 text-xs bg-orange-600 hover:bg-orange-700 self-start sm:self-auto"
                >
                  Edit &amp; Resubmit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Urgent Follow-ups & Green Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Enquiries Queue */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Incoming Enquiries ({newEnquiries.length})
              </h2>
            </div>
            <Link to="/sales/enquiries" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {newEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              All incoming leads have been contacted.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {newEnquiries.slice(0, 5).map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-700">{enq.enquiryId}</span>
                      <span className="font-bold text-slate-900">{enq.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{enq.phone} • {enq.selectedPackage}</div>
                  </div>
                  <Link
                    to="/sales/enquiries"
                    className="btn-primary py-1 px-3 text-xs"
                  >
                    Contact
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Green-Signalled for Supplier Bookings */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Ready for Supplier Bookings ({approvedForSuppliers.length})
              </h2>
            </div>
            <Link to="/sales/suppliers" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              Suppliers Desk <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {approvedForSuppliers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No trip requests currently awaiting supplier confirmation.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {approvedForSuppliers.slice(0, 5).map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-brand-800">{req.tripRequestId}</div>
                    <div className="font-bold text-slate-900">{req.customerName}</div>
                    <div className="text-[11px] text-slate-500">{req.packageName} ({req.travelDates})</div>
                  </div>
                  <Link
                    to="/sales/suppliers"
                    className="btn-primary py-1 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    Book Stays &amp; 4x4
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
