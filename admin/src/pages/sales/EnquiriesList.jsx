import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast, useConfirm } from '../../context/FeedbackContext';
import { usePreferences } from '../../context/PreferencesContext';
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
  
  // New Enquiry Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
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
  const [noteLoading, setNoteLoading] = useState(false);

  // Merge Duplicate Modal
  const [mergeSource, setMergeSource] = useState(null);
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [mergeLoading, setMergeLoading] = useState(false);

  const toast = useToast();
  const confirm = useConfirm();
  const { formatDate, formatDateTime } = usePreferences();

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enquiries');
      setEnquiries(res || []);
    } catch (e) {
      toast.error('Failed to load enquiries: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await api.post('/enquiries', formData);
      toast.success(`Enquiry ${res.enquiry?.enquiryId || ''} recorded successfully.`);
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
      toast.error(`Error saving enquiry: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenNotes = async (enquiry) => {
    setActiveEnquiryNotes(enquiry);
    try {
      const res = await api.get(`/enquiries/${enquiry.id}`);
      setNotesList(res.notes || []);
    } catch (e) {
      toast.error('Failed to load notes: ' + e.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.notes.trim()) return;
    setNoteLoading(true);
    try {
      await api.post(`/enquiries/${activeEnquiryNotes.id}/notes`, newNote);
      toast.success('Follow-up entry added');
      const res = await api.get(`/enquiries/${activeEnquiryNotes.id}`);
      setNotesList(res.notes || []);
      setNewNote({ contactMethod: 'PHONE_CALL', notes: '', followUpDate: '' });
      await loadEnquiries();
    } catch (err) {
      toast.error('Failed to save note: ' + err.message);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleStatusChange = async (enquiryId, nextStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}/status`, { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
      await loadEnquiries();
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  const handleMergeSubmit = async (e) => {
    e.preventDefault();
    if (!mergeSource || !mergeTargetId.trim()) return;
    setMergeLoading(true);
    try {
      await api.post(`/enquiries/${mergeSource.id}/merge`, {
        targetEnquiryId: mergeTargetId.trim(),
        mergeNotes: 'Merged duplicate via Sales Workspace'
      });
      toast.success(`Duplicate ${mergeSource.enquiryId} merged into ${mergeTargetId}.`);
      setMergeSource(null);
      setMergeTargetId('');
      await loadEnquiries();
    } catch (err) {
      toast.error('Merge failed: ' + err.message);
    } finally {
      setMergeLoading(false);
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
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Customer Ingestion & Pipeline"
        title="Enquiries Management"
        description="Website leads, telephone calls, negotiations, follow-up history, and duplicate resolution."
        icon={FileText}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Log Call / Offline Enquiry
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
            placeholder="Search customer, phone, package, enquiry ID..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Leads' },
            { id: 'NEW', label: 'New' },
            { id: 'CONTACTED', label: 'Contacted' },
            { id: 'NEGOTIATION', label: 'Negotiation' },
            { id: 'CUSTOMER_ACCEPTED_QUOTE', label: 'Accepted' },
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

      {/* Enquiries Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Retrieving customer enquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No enquiries found"
            description={search ? 'No enquiries matched your filter.' : 'No customer enquiries logged under this pipeline status.'}
            action={
              <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Log New Enquiry
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Enquiry ID</th>
                  <th className="py-3 px-4">Customer &amp; Contact</th>
                  <th className="py-3 px-4">Package &amp; Dates</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Sales Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition">
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
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                        <PhoneCall className="w-3 h-3 text-slate-400" /> {enq.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{enq.selectedPackage}</div>
                      <div className="text-[11px] text-slate-500">{enq.travelDates} • {enq.travellerCount} pax</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {enq.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg text-xs border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-brand-500"
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
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        Notes
                      </button>

                      {enq.isDuplicate && (
                        <button
                          onClick={() => {
                            setMergeSource(enq);
                            setMergeTargetId(enq.duplicateOfEnquiryId || '');
                          }}
                          className="btn-secondary py-1 px-2.5 text-xs text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
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
                          className="btn-primary py-1 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 inline-flex items-center gap-1"
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
        )}
      </div>

      {/* Log New Call/Enquiry Modal */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          title="Log Customer Enquiry / Call"
          description="Capture new prospect details from inbound telephone queries or walk-ins."
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
                form="create-enquiry-form"
                disabled={createLoading}
                className="btn-primary text-xs"
              >
                {createLoading ? 'Logging...' : 'Log Enquiry'}
              </button>
            </>
          }
        >
          <form id="create-enquiry-form" onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="input text-xs"
                >
                  <option value="PHONE_CALL">Telephone Call</option>
                  <option value="EMAIL">Email Inquiry</option>
                  <option value="WEBSITE">Website Form (Manual)</option>
                  <option value="OFFLINE">In-Person / Office Visit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="Leave blank if same as phone"
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@gmail.com"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Travellers Count</label>
                <input
                  type="number"
                  min="1"
                  value={formData.travellerCount}
                  onChange={(e) => setFormData({ ...formData, travellerCount: parseInt(e.target.value, 10) || 1 })}
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tour Package</label>
                <input
                  type="text"
                  value={formData.selectedPackage}
                  onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                  placeholder="Package name or custom route"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Dates / Window</label>
                <input
                  type="text"
                  value={formData.travelDates}
                  onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                  placeholder="e.g. 15 Dec 2026 - 22 Dec 2026"
                  className="input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Inquiries &amp; Notes</label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Specific customer requests or notes discussed on call..."
                className="input resize-none text-xs"
              />
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
          description="Log phone conversations, WhatsApp chats, and agreed itinerary adjustments."
        >
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Add Follow-up Entry</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={newNote.contactMethod}
                  onChange={(e) => setNewNote({ ...newNote, contactMethod: e.target.value })}
                  className="input text-xs"
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
                  className="input text-xs"
                />
              </div>
              <textarea
                rows={2}
                required
                value={newNote.notes}
                onChange={(e) => setNewNote({ ...newNote, notes: e.target.value })}
                placeholder="Summary of customer negotiation and agreed pricing details..."
                className="input resize-none text-xs"
              />
              <div className="text-right">
                <button
                  type="submit"
                  disabled={noteLoading || !newNote.notes.trim()}
                  className="btn-primary text-xs py-1 px-3"
                >
                  {noteLoading ? 'Saving...' : 'Add Entry'}
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">History</span>
              {notesList.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">No follow-up notes recorded yet.</div>
              ) : (
                notesList.map((n) => (
                  <div key={n.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700">{n.authorName} ({n.contactMethod})</span>
                      <span className="font-mono">{formatDateTime(n.createdAt)}</span>
                    </div>
                    <p className="text-slate-800 whitespace-pre-wrap">{n.notes}</p>
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
          description={`Customer: ${mergeSource.customerName} • Phone: ${mergeSource.phone}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setMergeSource(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="merge-enquiry-form"
                disabled={mergeLoading || !mergeTargetId.trim()}
                className="btn-primary text-xs bg-amber-600 hover:bg-amber-700"
              >
                {mergeLoading ? 'Merging...' : 'Confirm Merge'}
              </button>
            </>
          }
        >
          <form id="merge-enquiry-form" onSubmit={handleMergeSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <strong>Soft Merge Policy:</strong>
              <p>This action will transfer all follow-up notes and contact links into the target enquiry, and archive {mergeSource.enquiryId} while preserving full historical audit logs.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Master Enquiry ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={mergeTargetId}
                onChange={(e) => setMergeTargetId(e.target.value)}
                placeholder="e.g. ENQ-2002"
                className="input text-xs font-mono"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
