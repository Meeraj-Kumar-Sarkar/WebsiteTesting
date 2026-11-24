import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast, useConfirm } from '../../context/FeedbackContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  CalendarCheck,
  Plus,
  Send,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Search,
  Trash2,
  FileText,
  RotateCcw
} from 'lucide-react';

export default function TripRequestsList() {
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    enquiryId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    packageName: 'Spiti Valley High-Pass Circuit',
    travelDates: '',
    agreedAmount: '',
    currency: 'INR',
    salesNotes: '',
    customerRequirements: '',
    travellers: [
      { fullName: '', age: '', dob: '', gender: 'Male', emergencyContact: '', relationship: 'Primary Traveller', specialNotes: '' }
    ]
  });

  // Deposit Modal
  const [depositModalReq, setDepositModalReq] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDueDate, setDepositDueDate] = useState('');
  const [depositReason, setDepositReason] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);

  const toast = useToast();
  const confirm = useConfirm();
  const { formatDate } = usePreferences();

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trip-requests');
      setRequests(res || []);
    } catch (e) {
      toast.error('Failed to load trip requests: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // Check if prefill state passed from enquiries
    if (location.state?.prefill) {
      const p = location.state.prefill;
      setFormData((prev) => ({
        ...prev,
        enquiryId: p.enquiryId || '',
        customerName: p.customerName || '',
        customerPhone: p.customerPhone || '',
        customerEmail: p.customerEmail || '',
        packageName: p.packageName || 'Spiti Valley High-Pass Circuit',
        travelDates: p.travelDates || '',
        travellers: [
          { fullName: p.customerName, age: '', dob: '', gender: 'Male', emergencyContact: p.customerPhone, relationship: 'Primary Traveller', specialNotes: '' }
        ]
      }));
      setShowCreateModal(true);
    }
  }, [location.state]);

  const addTravellerRow = () => {
    setFormData({
      ...formData,
      travellers: [
        ...formData.travellers,
        { fullName: '', age: '', dob: '', gender: 'Male', emergencyContact: '', relationship: 'Traveller', specialNotes: '' }
      ]
    });
  };

  const removeTravellerRow = (index) => {
    if (formData.travellers.length <= 1) return;
    setFormData({
      ...formData,
      travellers: formData.travellers.filter((_, idx) => idx !== index)
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (formData.travellers.some((t) => !t.fullName.trim())) {
      toast.warning('All travellers must have a full name.');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await api.post('/trip-requests', formData);
      toast.success(`Trip Request ${res.tripRequestId} drafted successfully.`);
      setShowCreateModal(false);
      await loadRequests();
    } catch (err) {
      toast.error(`Error saving request: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSubmitForReview = async (reqId) => {
    const ok = await confirm({
      title: 'Submit for Executive & Finance Review?',
      message: 'This will lock draft changes and dispatch notifications to Finance for billing and Master for authorization.',
      confirmText: 'Submit for Review'
    });
    if (!ok) return;

    try {
      await api.post(`/trip-requests/${reqId}/submit`, {});
      toast.success('Trip request submitted to Finance and Master queues.');
      await loadRequests();
    } catch (err) {
      toast.error('Submission failed: ' + err.message);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositModalReq || !depositAmount) return;
    setDepositLoading(true);
    try {
      await api.post(`/trip-requests/${depositModalReq.id}/deposit-exception`, {
        depositAmount,
        dueDate: depositDueDate,
        reason: depositReason
      });
      toast.success('Deposit exception forwarded to Master for authorization.');
      setDepositModalReq(null);
      setDepositAmount('');
      setDepositDueDate('');
      setDepositReason('');
      await loadRequests();
    } catch (err) {
      toast.error('Failed to submit exception: ' + err.message);
    } finally {
      setDepositLoading(false);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.tripRequestId?.toLowerCase().includes(q) ||
      r.customerName?.toLowerCase().includes(q) ||
      r.packageName?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Booking Dossiers & Proposals"
        title="Trip Requests"
        description="Dossiers submitted by Sales for financial assessment, invoice issuance, and Master green-signal authorization."
        icon={CalendarCheck}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Prepare Trip Request
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request ID, customer, package..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'DRAFT', label: 'Drafts' },
            { id: 'SUBMITTED', label: 'Submitted' },
            { id: 'PAYMENT_PENDING', label: 'Payment Pending' },
            { id: 'APPROVED_FOR_SUPPLIER_BOOKING', label: 'Approved Booking' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st.id
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Retrieving trip requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No trip requests found"
            description={search ? 'No requests match your search criteria.' : 'No proposals found under this workflow stage.'}
            action={
              <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Create Trip Request
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package &amp; Dates</th>
                  <th className="py-3 px-4">Travellers</th>
                  <th className="py-3 px-4">Agreed Amount</th>
                  <th className="py-3 px-4">Workflow State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {req.tripRequestId}
                      {req.enquiryId && (
                        <span className="block text-[10px] text-slate-400 font-normal">From {req.enquiryId}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{req.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{req.packageName}</div>
                      <div className="text-[11px] text-slate-500">{req.travelDates}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 tabular-nums">
                      {req.travellerCount} pax
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      ₹{req.agreedAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {req.status === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitForReview(req.id)}
                          className="btn-primary py-1 px-3 text-xs inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Submit for Review
                        </button>
                      )}

                      {req.status === 'CHANGES_REQUESTED' && (
                        <button
                          onClick={() => handleSubmitForReview(req.id)}
                          className="btn-primary py-1 px-3 text-xs bg-amber-600 hover:bg-amber-700"
                        >
                          Resubmit Corrections
                        </button>
                      )}

                      {!req.depositAllowed && (req.status === 'SUBMITTED' || req.status === 'PAYMENT_PENDING' || req.status === 'DRAFT') && (
                        <button
                          onClick={() => {
                            setDepositModalReq(req);
                            setDepositAmount((req.agreedAmount * 0.3).toString());
                          }}
                          className="btn-secondary py-1 px-2.5 text-xs text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100"
                          title="Request Master permission for advance deposit"
                        >
                          Request Deposit Exception
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Prepare Trip Request Modal with Travellers Collection */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          title="Prepare Trip Request & Traveller Details"
          description="Build itinerary proposal, register travelling passengers, and lock quotation."
          maxWidth="max-w-4xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-trip-request-form"
                disabled={createLoading}
                className="btn-primary text-xs"
              >
                {createLoading ? 'Saving...' : 'Save Draft Proposal'}
              </button>
            </>
          }
        >
          <form id="create-trip-request-form" onSubmit={handleCreateSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Travel Dates Window <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.travelDates}
                  onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                  placeholder="e.g. 15 Dec 2026 - 22 Dec 2026"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agreed Amount (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.agreedAmount}
                  onChange={(e) => setFormData({ ...formData, agreedAmount: e.target.value })}
                  placeholder="95000"
                  className="input text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Negotiation Notes</label>
              <textarea
                rows={2}
                value={formData.salesNotes}
                onChange={(e) => setFormData({ ...formData, salesNotes: e.target.value })}
                placeholder="Details of quotation agreed with customer..."
                className="input resize-none text-xs"
              />
            </div>

            {/* Travellers Section */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-600" />
                    Traveller Profiles ({formData.travellers.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">Contact person may not be a passenger; register each traveller.</p>
                </div>
                <button
                  type="button"
                  onClick={addTravellerRow}
                  className="btn-secondary py-1 px-2.5 text-xs"
                >
                  + Add Traveller
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {formData.travellers.map((traveller, index) => (
                  <div key={index} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs grid grid-cols-1 sm:grid-cols-4 gap-2.5 relative">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Full Name</label>
                      <input
                        type="text"
                        required
                        value={traveller.fullName}
                        onChange={(e) => {
                          const updated = [...formData.travellers];
                          updated[index].fullName = e.target.value;
                          setFormData({ ...formData, travellers: updated });
                        }}
                        placeholder="Traveller name"
                        className="input text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Age / Gender</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={traveller.age}
                          onChange={(e) => {
                            const updated = [...formData.travellers];
                            updated[index].age = e.target.value;
                            setFormData({ ...formData, travellers: updated });
                          }}
                          placeholder="Age"
                          className="input w-16 text-xs"
                        />
                        <select
                          value={traveller.gender}
                          onChange={(e) => {
                            const updated = [...formData.travellers];
                            updated[index].gender = e.target.value;
                            setFormData({ ...formData, travellers: updated });
                          }}
                          className="input flex-1 text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Emergency Phone</label>
                      <input
                        type="tel"
                        value={traveller.emergencyContact}
                        onChange={(e) => {
                          const updated = [...formData.travellers];
                          updated[index].emergencyContact = e.target.value;
                          setFormData({ ...formData, travellers: updated });
                        }}
                        placeholder="+91 Phone"
                        className="input text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-semibold text-slate-500">Relationship</label>
                        <input
                          type="text"
                          value={traveller.relationship}
                          onChange={(e) => {
                            const updated = [...formData.travellers];
                            updated[index].relationship = e.target.value;
                            setFormData({ ...formData, travellers: updated });
                          }}
                          placeholder="Self, Spouse, Child"
                          className="input text-xs"
                        />
                      </div>
                      {formData.travellers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTravellerRow(index)}
                          className="mt-4 p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                          title="Remove traveller"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Deposit Modal */}
      {depositModalReq && (
        <Modal
          isOpen={true}
          onClose={() => setDepositModalReq(null)}
          title={`Request Advance Deposit Exception: ${depositModalReq.tripRequestId}`}
          description="Default payment policy is 100% upfront. Master authorization is required for partial split deposits."
          footer={
            <>
              <button
                type="button"
                onClick={() => setDepositModalReq(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="deposit-exception-form"
                disabled={depositLoading || !depositAmount}
                className="btn-primary text-xs bg-purple-600 hover:bg-purple-700"
              >
                {depositLoading ? 'Requesting...' : 'Request Master Approval'}
              </button>
            </>
          }
        >
          <form id="deposit-exception-form" onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proposed Initial Deposit Amount (INR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="input text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Balance Due Date
              </label>
              <input
                type="date"
                value={depositDueDate}
                onChange={(e) => setDepositDueDate(e.target.value)}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sales Justification for Exception
              </label>
              <textarea
                rows={2}
                value={depositReason}
                onChange={(e) => setDepositReason(e.target.value)}
                placeholder="Reason customer requested split payment..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
