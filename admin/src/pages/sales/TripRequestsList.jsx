import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
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
  FileText
} from 'lucide-react';

export default function TripRequestsList() {
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trip-requests');
      setRequests(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // Check if prefill state passed from enquiries
    if (location.state?.prefill) {
      const p = location.state.prefill;
      setFormData(prev => ({
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
    if (formData.travellers.some(t => !t.fullName.trim())) {
      alert('All travellers must have a full name.');
      return;
    }
    try {
      const res = await api.post('/trip-requests', formData);
      setFeedback(`Trip Request ${res.tripRequestId} drafted successfully. Next step: submit for Finance & Master review.`);
      setShowCreateModal(false);
      await loadRequests();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handleSubmitForReview = async (reqId) => {
    try {
      await api.post(`/trip-requests/${reqId}/submit`, {});
      setFeedback('Trip request successfully submitted to Finance and Master queues.');
      await loadRequests();
    } catch (err) {
      alert('Submission failed: ' + err.message);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositModalReq || !depositAmount) return;
    try {
      await api.post(`/trip-requests/${depositModalReq.id}/deposit-exception`, {
        depositAmount,
        dueDate: depositDueDate,
        reason: depositReason
      });
      setFeedback(`Deposit exception forwarded to Master for authorization.`);
      setDepositModalReq(null);
      setDepositAmount('');
      setDepositDueDate('');
      setDepositReason('');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const filtered = requests.filter(r =>
    !search ||
    r.tripRequestId?.toLowerCase().includes(search.toLowerCase()) ||
    r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    r.packageName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <CalendarCheck className="w-4 h-4 text-brand-600" />
            Booking Dossiers & Proposals
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Trip Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossiers submitted by Sales for financial assessment, invoice issuance, and Master green-signal authorization.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Prepare Trip Request
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, customer..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Package & Dates</th>
                <th className="py-3 px-4">Travellers</th>
                <th className="py-3 px-4">Agreed Amount</th>
                <th className="py-3 px-4">Workflow State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    {req.tripRequestId}
                    {req.enquiryId && (
                      <span className="block text-[10px] text-slate-400 font-normal">From {req.enquiryId}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{req.customerName}</div>
                    <div className="text-[11px] text-slate-500">{req.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{req.packageName}</div>
                    <div className="text-[11px] text-slate-500">{req.travelDates}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {req.travellerCount} pax
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{req.agreedAmount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={req.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {req.status === 'DRAFT' && (
                      <button
                        onClick={() => handleSubmitForReview(req.id)}
                        className="px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition inline-flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Submit for Review
                      </button>
                    )}

                    {req.status === 'CHANGES_REQUESTED' && (
                      <button
                        onClick={() => handleSubmitForReview(req.id)}
                        className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition"
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
                        className="px-2 py-1 rounded border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs font-semibold"
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
      </div>

      {/* Prepare Trip Request Modal with Travellers Collection */}
      {showCreateModal && (
        <Modal isOpen={true} onClose={() => setShowCreateModal(false)} title="Prepare Trip Request & Traveller Details" maxWidth="max-w-4xl">
          <form onSubmit={handleCreateSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Travel Dates Window</label>
                <input
                  type="text"
                  required
                  value={formData.travelDates}
                  onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                  placeholder="e.g. 15 Dec 2026 - 22 Dec 2026"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Agreed Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={formData.agreedAmount}
                  onChange={(e) => setFormData({ ...formData, agreedAmount: e.target.value })}
                  placeholder="95000"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Sales Negotiation Notes</label>
              <textarea
                rows={2}
                value={formData.salesNotes}
                onChange={(e) => setFormData({ ...formData, salesNotes: e.target.value })}
                placeholder="Details of quotation agreed with customer..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
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
                  <p className="text-[11px] text-slate-500">Contact person may not be a traveller; collect each passenger details.</p>
                </div>
                <button
                  type="button"
                  onClick={addTravellerRow}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  + Add Traveller
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {formData.travellers.map((traveller, index) => (
                  <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-4 gap-2 relative">
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
                        className="w-full px-2 py-1 border rounded text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Age / Gender</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={traveller.age}
                          onChange={(e) => {
                            const updated = [...formData.travellers];
                            updated[index].age = e.target.value;
                            setFormData({ ...formData, travellers: updated });
                          }}
                          placeholder="Age"
                          className="w-16 px-2 py-1 border rounded text-xs bg-white"
                        />
                        <select
                          value={traveller.gender}
                          onChange={(e) => {
                            const updated = [...formData.travellers];
                            updated[index].gender = e.target.value;
                            setFormData({ ...formData, travellers: updated });
                          }}
                          className="flex-1 px-1 py-1 border rounded text-xs bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Emergency Contact</label>
                      <input
                        type="tel"
                        value={traveller.emergencyContact}
                        onChange={(e) => {
                          const updated = [...formData.travellers];
                          updated[index].emergencyContact = e.target.value;
                          setFormData({ ...formData, travellers: updated });
                        }}
                        placeholder="+91 Phone"
                        className="w-full px-2 py-1 border rounded text-xs bg-white"
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
                          placeholder="Spouse, Child, Self"
                          className="w-full px-2 py-1 border rounded text-xs bg-white"
                        />
                      </div>
                      {formData.travellers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTravellerRow(index)}
                          className="mt-4 p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">
                Save Draft Proposal
              </button>
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
        >
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 space-y-1">
              <strong>Policy Exception Rule:</strong>
              <p>Default payment is 100% upfront. Master authorization is required for partial deposit collections.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Proposed Deposit Amount (INR)
              </label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Balance Due Date
              </label>
              <input
                type="date"
                value={depositDueDate}
                onChange={(e) => setDepositDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Sales Justification for Exception
              </label>
              <textarea
                rows={2}
                value={depositReason}
                onChange={(e) => setDepositReason(e.target.value)}
                placeholder="Reason customer requested split payment..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setDepositModalReq(null)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold">
                Request Master Approval
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
