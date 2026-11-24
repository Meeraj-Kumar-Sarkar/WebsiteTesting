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
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  DollarSign,
  Calendar,
  Users,
  Shield,
  FileText,
  Clock,
  Send,
  RotateCcw
} from 'lucide-react';

export default function ApprovalCentre() {
  const [activeTab, setActiveTab] = useState('TRIP_REQUESTS'); // 'TRIP_REQUESTS', 'REFUNDS'
  const [tripRequests, setTripRequests] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'APPROVE_TRIP', 'REJECT_TRIP', 'CHANGES_TRIP', 'APPROVE_REFUND', 'REJECT_REFUND'
  const [reasonText, setReasonText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const { formatDate, formatDateTime } = usePreferences();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/approvals');
      setTripRequests(res.tripRequests || []);
      setRefundRequests(res.refundRequests || []);
    } catch (err) {
      toast.error('Failed to load approvals queue: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async () => {
    if (!modalItem || !modalType) return;
    setActionLoading(true);

    try {
      if (modalType === 'APPROVE_TRIP') {
        await api.post(`/approvals/${modalItem.id}/approve`, { comments: reasonText });
        toast.success(`Trip Request ${modalItem.tripRequestId} approved. Green signal granted.`);
      } else if (modalType === 'REJECT_TRIP') {
        await api.post(`/approvals/${modalItem.id}/reject`, { reason: reasonText });
        toast.success(`Trip Request ${modalItem.tripRequestId} rejected.`);
      } else if (modalType === 'CHANGES_TRIP') {
        await api.post(`/approvals/${modalItem.id}/request-changes`, { changeNotes: reasonText });
        toast.success(`Requested modifications for ${modalItem.tripRequestId}.`);
      } else if (modalType === 'APPROVE_REFUND') {
        await api.post(`/refunds/${modalItem.id}/approve`, { approved: true, comments: reasonText });
        toast.success(`Cancellation approved for ${modalItem.tripRequestId}. Finance notified.`);
      } else if (modalType === 'REJECT_REFUND') {
        await api.post(`/refunds/${modalItem.id}/approve`, { approved: false, comments: reasonText });
        toast.success(`Cancellation rejected for ${modalItem.tripRequestId}.`);
      }

      setModalItem(null);
      setModalType(null);
      setReasonText('');
      await loadData();
    } catch (err) {
      toast.error(`Decision error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const totalPending = tripRequests.length + refundRequests.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Executive Decision Gate"
        title="Master Approval Centre"
        description="Clearance gateway for supplier bookings, financial exceptions, and customer cancellation refunds."
        icon={Shield}
        actions={
          <div className="flex bg-slate-100 p-1 rounded-xl border border-line">
            <button
              onClick={() => setActiveTab('TRIP_REQUESTS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'TRIP_REQUESTS' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trip Requests ({tripRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('REFUNDS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'REFUNDS' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Refund Authorizations ({refundRequests.length})
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Spinner className="w-8 h-8 text-brand-600" />
          <p className="text-xs text-slate-500">Checking pending executive authorizations...</p>
        </div>
      ) : activeTab === 'TRIP_REQUESTS' ? (
        /* Tab 1: Trip Requests Awaiting Decision */
        <div className="card overflow-hidden">
          {tripRequests.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All trip requests cleared"
              description="No proposals or booking clearances awaiting Master authorization right now."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {tripRequests.map((req) => (
                <div key={req.id} className="p-6 space-y-4 hover:bg-slate-50/60 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-700">{req.tripRequestId}</span>
                        <Badge status={req.status} />
                        {req.depositAllowed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            Deposit Exception Authorized (₹{req.depositAmount?.toLocaleString()})
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{req.customerName}</h3>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Package: <strong className="text-slate-800">{req.packageName}</strong></span>
                        <span>Dates: <strong className="text-slate-800">{req.travelDates}</strong></span>
                        <span>Travellers: <strong className="text-slate-800">{req.travellerCount} pax</strong></span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-500">Agreed Price</div>
                      <div className="text-xl font-black text-slate-900 tabular-nums">₹{req.agreedAmount?.toLocaleString()}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 tabular-nums">
                        ₹{req.verifiedPaymentsTotal?.toLocaleString() || 0} Verified in Bank
                      </div>
                    </div>
                  </div>

                  {/* Financial Report Snippet */}
                  {req.financialReport && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Est. Supplier Costs</span>
                        <span className="font-bold text-slate-800 tabular-nums">₹{req.financialReport.estimatedSupplierExpense?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Projected Margin</span>
                        <span className="font-bold text-emerald-700 tabular-nums">₹{req.financialReport.projectedMargin?.toLocaleString()} ({req.financialReport.marginPercentage}%)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Finance Clearance</span>
                        <span className="font-semibold text-emerald-600">Reconciled by Finance</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Submitted By</span>
                        <span className="font-mono text-slate-700">{req.submittedBy}</span>
                      </div>
                    </div>
                  )}

                  {req.salesNotes && (
                    <p className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                      <strong>Sales Negotiation Notes:</strong> {req.salesNotes}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setModalItem(req);
                        setModalType('APPROVE_TRIP');
                        setReasonText('Approved following complete payment verification and acceptable margin.');
                      }}
                      className="btn-primary py-1.5 px-3.5 text-xs bg-emerald-600 hover:bg-emerald-700 inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Grant Green Signal (Clear Supplier Booking)
                    </button>
                    <button
                      onClick={() => {
                        setModalItem(req);
                        setModalType('CHANGES_TRIP');
                        setReasonText('');
                      }}
                      className="btn-secondary py-1.5 px-3 text-xs text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => {
                        setModalItem(req);
                        setModalType('REJECT_TRIP');
                        setReasonText('');
                      }}
                      className="btn-secondary py-1.5 px-3 text-xs text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100"
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Refund & Cancellation Authorizations */
        <div className="card overflow-hidden">
          {refundRequests.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No cancellation authorizations pending"
              description="No cancellation tickets require executive decision at this time."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {refundRequests.map((ref) => (
                <div key={ref.id} className="p-6 space-y-4 hover:bg-slate-50/60 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-700">{ref.refundId}</span>
                        <Badge status={ref.status} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{ref.customerName}</h3>
                      <div className="text-xs text-slate-500">
                        Linked Trip Request: <span className="font-mono text-slate-800 font-bold">{ref.tripRequestId}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-500">Amount Paid</div>
                      <div className="text-xl font-bold text-slate-900 tabular-nums">₹{ref.amountPaid?.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-500">Total Booking: ₹{ref.agreedBookingAmount?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                    <div><strong>Customer Cancellation Reason:</strong> {ref.customerReason}</div>
                    <div className="text-[11px] text-rose-600 font-mono">
                      Requested at: {formatDateTime(ref.cancellationRequestedAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setModalItem(ref);
                        setModalType('APPROVE_REFUND');
                        setReasonText('Cancellation and refund calculation authorized.');
                      }}
                      className="btn-primary py-1.5 px-3.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                    >
                      Authorize Cancellation &amp; Refund
                    </button>
                    <button
                      onClick={() => {
                        setModalItem(ref);
                        setModalType('REJECT_REFUND');
                        setReasonText('');
                      }}
                      className="btn-secondary py-1.5 px-3 text-xs text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100"
                    >
                      Reject Cancellation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Decision Modal */}
      {modalItem && modalType && (
        <Modal
          isOpen={true}
          onClose={() => { setModalItem(null); setModalType(null); }}
          title={`Executive Decision: ${modalType.replace(/_/g, ' ')}`}
          description="Every approval or rejection is permanently logged in the immutable audit ledger."
          footer={
            <>
              <button
                type="button"
                onClick={() => { setModalItem(null); setModalType(null); }}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !reasonText.trim()}
                onClick={handleDecision}
                className="btn-primary text-xs"
              >
                {actionLoading ? 'Recording...' : 'Confirm Decision'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Comments / Decision Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Enter justification or specific guidance..."
                className="input resize-none text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
