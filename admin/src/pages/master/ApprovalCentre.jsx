import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
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
  Clock
} from 'lucide-react';

export const ApprovalCentre = () => {
  const [activeTab, setActiveTab] = useState('TRIP_REQUESTS'); // 'TRIP_REQUESTS', 'REFUNDS'
  const [tripRequests, setTripRequests] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'APPROVE_TRIP', 'REJECT_TRIP', 'CHANGES_TRIP', 'APPROVE_REFUND', 'REJECT_REFUND'
  const [reasonText, setReasonText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/approvals');
      setTripRequests(res.tripRequests || []);
      setRefundRequests(res.refundRequests || []);
    } catch (err) {
      console.error(err);
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
    setFeedback('');

    try {
      if (modalType === 'APPROVE_TRIP') {
        await api.post(`/approvals/${modalItem.id}/approve`, { comments: reasonText });
        setFeedback(`Trip Request ${modalItem.tripRequestId} approved. Sales green signal granted.`);
      } else if (modalType === 'REJECT_TRIP') {
        await api.post(`/approvals/${modalItem.id}/reject`, { reason: reasonText });
        setFeedback(`Trip Request ${modalItem.tripRequestId} rejected.`);
      } else if (modalType === 'CHANGES_TRIP') {
        await api.post(`/approvals/${modalItem.id}/request-changes`, { changeNotes: reasonText });
        setFeedback(`Requested modifications for ${modalItem.tripRequestId}.`);
      } else if (modalType === 'APPROVE_REFUND') {
        await api.post(`/refunds/${modalItem.id}/approve`, { approved: true, comments: reasonText });
        setFeedback(`Cancellation approved for ${modalItem.tripRequestId}. Finance will now calculate refund.`);
      } else if (modalType === 'REJECT_REFUND') {
        await api.post(`/refunds/${modalItem.id}/approve`, { approved: false, comments: reasonText });
        setFeedback(`Cancellation rejected for ${modalItem.tripRequestId}.`);
      }

      setModalItem(null);
      setModalType(null);
      setReasonText('');
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <Shield className="w-4 h-4 text-brand-600" />
            Executive Decision Gate
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Master Approval Centre
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clearance gateway for supplier bookings, financial exceptions, and customer cancellation refunds.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('TRIP_REQUESTS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'TRIP_REQUESTS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trip Requests ({tripRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('REFUNDS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'REFUNDS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Refund Authorizations ({refundRequests.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Tab 1: Trip Requests Awaiting Decision */}
      {activeTab === 'TRIP_REQUESTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {tripRequests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              All trip requests have been reviewed. No items awaiting approval.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {tripRequests.map((req) => (
                <div key={req.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-700">{req.tripRequestId}</span>
                        <Badge status={req.status} />
                        {req.depositAllowed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Deposit Exception Authorized (₹{req.depositAmount?.toLocaleString()})
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{req.customerName}</h3>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Package: <strong>{req.packageName}</strong></span>
                        <span>Dates: <strong>{req.travelDates}</strong></span>
                        <span>Travellers: <strong>{req.travellerCount} pax</strong></span>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-xs text-slate-500">Agreed Customer Price</div>
                      <div className="text-xl font-black text-slate-900">₹{req.agreedAmount?.toLocaleString()}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ₹{req.verifiedPaymentsTotal?.toLocaleString() || 0} Verified in Bank
                      </div>
                    </div>
                  </div>

                  {/* Financial Report Snippet */}
                  {req.financialReport && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Est. Supplier Costs</span>
                        <span className="font-bold text-slate-800">₹{req.financialReport.estimatedSupplierExpense?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Projected Margin</span>
                        <span className="font-bold text-emerald-700">₹{req.financialReport.projectedMargin?.toLocaleString()} ({req.financialReport.marginPercentage}%)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Finance Clearance</span>
                        <span className="font-semibold text-emerald-600">Verified by Finance</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Submitted By</span>
                        <span className="font-mono text-slate-700">{req.submittedBy}</span>
                      </div>
                    </div>
                  )}

                  {req.salesNotes && (
                    <p className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded border border-amber-200">
                      <strong>Sales Negotiation Notes:</strong> {req.salesNotes}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setModalItem(req);
                        setModalType('APPROVE_TRIP');
                        setReasonText('Approved following complete payment verification and acceptable margin.');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
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
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-medium text-xs transition"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => {
                        setModalItem(req);
                        setModalType('REJECT_TRIP');
                        setReasonText('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-medium text-xs transition"
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Refund & Cancellation Authorizations */}
      {activeTab === 'REFUNDS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {refundRequests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No cancellation requests awaiting Master review.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {refundRequests.map((ref) => (
                <div key={ref.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-700">{ref.refundId}</span>
                        <Badge status={ref.status} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{ref.customerName}</h3>
                      <div className="text-xs text-slate-500">
                        Linked Trip Request: <span className="font-mono text-slate-700 font-bold">{ref.tripRequestId}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Amount Paid</div>
                      <div className="text-xl font-bold text-slate-900">₹{ref.amountPaid?.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-500">Total Booking: ₹{ref.agreedBookingAmount?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                    <div><strong>Customer Cancellation Reason:</strong> {ref.customerReason}</div>
                    <div className="text-[11px] text-rose-600">Requested at: {new Date(ref.cancellationRequestedAt).toLocaleString()}</div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setModalItem(ref);
                        setModalType('APPROVE_REFUND');
                        setReasonText('Cancellation and refund calculation authorized.');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
                    >
                      Authorize Cancellation & Refund
                    </button>
                    <button
                      onClick={() => {
                        setModalItem(ref);
                        setModalType('REJECT_REFUND');
                        setReasonText('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-medium text-xs transition"
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
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Please provide notes or reason for this action. Every approval or rejection is recorded in the immutable audit log.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Executive Comments / Reason
              </label>
              <textarea
                rows={3}
                required
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Enter justification or reason..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setModalItem(null); setModalType(null); }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !reasonText.trim()}
                onClick={handleDecision}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow transition disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApprovalCentre;
