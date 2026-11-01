import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  FileText,
  Plus,
  PhoneCall,
  Mail,
  Search,
  AlertTriangle,
  GitMerge,
  Archive,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function EnquiriesList() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');

  // New Enquiry Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    source: 'PHONE_CALL',
    customerName: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    selectedPackage: 'Spiti Valley High-Pass Circuit',
    travelDates: '',
    travellerCount: 2,
    message: ''
  });

  // Notes Modal
  const [activeEnquiryNotes, setActiveEnquiryNotes] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [newNote, setNewNote] = useState({ contactMethod: 'PHONE_CALL', notes: '', followUpDate: '' });

  // Merge Duplicate Modal
  const [mergeSource, setMergeSource] = useState(null);
  const [mergeTargetId, setMergeTargetId] = useState('');

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enquiries');
      setEnquiries(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/enquiries', formData);
      setFeedback(`Enquiry ${res.enquiry.enquiryId} recorded successfully.`);
      setShowCreateModal(false);
      setFormData({
        source: 'PHONE_CALL',
        customerName: '',
        phone: '',
        whatsappNumber: '',
        email: '',
        selectedPackage: 'Spiti Valley High-Pass Circuit',
        travelDates: '',
        travellerCount: 2,
        message: ''
      });
      await loadEnquiries();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handleOpenNotes = async (enquiry) => {
    setActiveEnquiryNotes(enquiry);
    try {
      const res = await api.get(`/enquiries/${enquiry.id}`);
      setNotesList(res.notes || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.notes.trim()) return;
    try {
      await api.post(`/enquiries/${activeEnquiryNotes.id}/notes`, newNote);
      const res = await api.get(`/enquiries/${activeEnquiryNotes.id}`);
      setNotesList(res.notes || []);
      setNewNote({ contactMethod: 'PHONE_CALL', notes: '', followUpDate: '' });
      await loadEnquiries();
    } catch (err) {
      alert('Failed to save note: ' + err.message);
    }
  };

  const handleStatusChange = async (enquiryId, nextStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}/status`, { status: nextStatus });
      await loadEnquiries();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleMergeSubmit = async (e) => {
    e.preventDefault();
    if (!mergeSource || !mergeTargetId) return;
    try {
      await api.post(`/enquiries/${mergeSource.id}/merge`, {
        targetEnquiryId: mergeTargetId,
        mergeNotes: 'Merged probable duplicate via Sales Workspace'
      });
      setFeedback(`Duplicate ${mergeSource.enquiryId} successfully merged into ${mergeTargetId}.`);
      setMergeSource(null);
      setMergeTargetId('');
      await loadEnquiries();
    } catch (err) {
      alert('Merge failed: ' + err.message);
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.enquiryId?.toLowerCase().includes(q) ||
      e.customerName?.toLowerCase().includes(q) ||
      e.phone?.includes(q) ||
      e.selectedPackage?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <FileText className="w-4 h-4 text-brand-600" />
            Customer Ingestion & Pipeline
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Enquiries Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Website leads, telephone calls, negotiations, follow-up history, and duplicate resolution.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Log Call / Offline Enquiry
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, package..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'NEW', 'CONTACTED', 'NEGOTIATION', 'CUSTOMER_ACCEPTED_QUOTE'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'CUSTOMER_ACCEPTED_QUOTE' ? 'Accepted' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Enquiry ID</th>
                <th className="py-3 px-4">Customer & Contact</th>
                <th className="py-3 px-4">Package & Dates</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Sales Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    {enq.enquiryId}
                    {enq.isDuplicate && (
                      <span className="block text-[10px] font-bold text-amber-600 mt-0.5">
                        ⚠️ Duplicate of {enq.duplicateOfEnquiryId}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{enq.customerName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <PhoneCall className="w-3 h-3 text-slate-400" /> {enq.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{enq.selectedPackage}</div>
                    <div className="text-[11px] text-slate-500">{enq.travelDates} • {enq.travellerCount} pax</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {enq.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className="px-2 py-1 rounded text-xs border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="INTERESTED">INTERESTED</option>
                      <option value="NEGOTIATION">NEGOTIATION</option>
                      <option value="CUSTOMER_ACCEPTED_QUOTE">CUSTOMER_ACCEPTED_QUOTE</option>
                      <option value="DETAILS_PENDING">DETAILS_PENDING</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenNotes(enq)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
                    >
                      Notes
                    </button>

                    {enq.isDuplicate && (
                      <button
                        onClick={() => {
                          setMergeSource(enq);
                          setMergeTargetId(enq.duplicateOfEnquiryId || '');
                        }}
                        className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 transition"
                      >
                        Merge
                      </button>
                    )}

                    {enq.status === 'CUSTOMER_ACCEPTED_QUOTE' && (
                      <button
                        onClick={() => {
                          navigate('/sales/trip-requests', {
                            state: {
                              prefill: {
                                enquiryId: enq.enquiryId,
                                customerName: enq.customerName,
                                customerPhone: enq.phone,
                                customerEmail: enq.email,
                                packageName: enq.selectedPackage,
                                travelDates: enq.travelDates,
                                travellerCount: enq.travellerCount
                              }
                            }
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition inline-flex items-center gap-1"
                      >
                        Create Trip Request <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log New Call/Enquiry Modal */}
      {showCreateModal && (
        <Modal isOpen={true} onClose={() => setShowCreateModal(false)} title="Log Customer Enquiry / Call">
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="PHONE_CALL">Telephone Call</option>
                  <option value="EMAIL">Email Inquiry</option>
                  <option value="WEBSITE">Website Form (Manual)</option>
                  <option value="OFFLINE">In-Person / Office Visit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Primary Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="Leave blank if same as phone"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@gmail.com"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Travellers Count</label>
                <input
                  type="number"
                  min="1"
                  value={formData.travellerCount}
                  onChange={(e) => setFormData({ ...formData, travellerCount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Tour Package</label>
                <input
                  type="text"
                  value={formData.selectedPackage}
                  onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                  placeholder="Package name or custom route"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Travel Dates / Window</label>
                <input
                  type="text"
                  value={formData.travelDates}
                  onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                  placeholder="e.g. 15 Dec 2026 - 22 Dec 2026"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Customer Inquiries & Notes</label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Specific customer requests or notes discussed on call..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">
                Log Enquiry
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Follow-up Communication Notes Modal */}
      {activeEnquiryNotes && (
        <Modal
          isOpen={true}
          onClose={() => setActiveEnquiryNotes(null)}
          title={`Follow-up Notes: ${activeEnquiryNotes.customerName} (${activeEnquiryNotes.enquiryId})`}
        >
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Add Follow-up Entry</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newNote.contactMethod}
                  onChange={(e) => setNewNote({ ...newNote, contactMethod: e.target.value })}
                  className="px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                >
                  <option value="PHONE_CALL">Phone Call</option>
                  <option value="WHATSAPP">WhatsApp Message</option>
                  <option value="EMAIL">Email</option>
                  <option value="IN_PERSON">In-Person Meeting</option>
                </select>
                <input
                  type="date"
                  value={newNote.followUpDate}
                  onChange={(e) => setNewNote({ ...newNote, followUpDate: e.target.value })}
                  className="px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                />
              </div>
              <textarea
                rows={2}
                required
                value={newNote.notes}
                onChange={(e) => setNewNote({ ...newNote, notes: e.target.value })}
                placeholder="Summary of customer negotiation and agreed pricing details..."
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
              />
              <div className="text-right">
                <button type="submit" className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg shadow-sm">
                  Add Entry
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">History</span>
              {notesList.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">No follow-up notes yet.</div>
              ) : (
                notesList.map((n) => (
                  <div key={n.id} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700">{n.authorName} ({n.contactMethod})</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800">{n.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Merge Modal */}
      {mergeSource && (
        <Modal
          isOpen={true}
          onClose={() => setMergeSource(null)}
          title={`Resolve Duplicate: Merge ${mergeSource.enquiryId}`}
        >
          <form onSubmit={handleMergeSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
              <strong>Soft Merge Policy:</strong>
              <p>This action will transfer all follow-up notes and contact links into the target enquiry, and archive {mergeSource.enquiryId} while preserving full historical audit logs.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Target Master Enquiry ID
              </label>
              <input
                type="text"
                required
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                placeholder="e.g. ENQ-2002"
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setMergeSource(null)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm">
                Confirm Merge
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
