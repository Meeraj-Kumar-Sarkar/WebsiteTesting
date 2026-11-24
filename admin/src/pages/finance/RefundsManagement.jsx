import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast, useConfirm } from '../../context/FeedbackContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  AlertCircle,
  Plus,
  CheckCircle2,
  XCircle,
  Calculator,
  DollarSign,
  ArrowRight,
  Clock,
  Search,
  ShieldAlert,
  Percent
} from 'lucide-react';

export default function RefundsManagement() {
  const [refunds, setRefunds] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Cancellation request modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelForm, setCancelForm] = useState({
    tripRequestId: '',
    customerReason: '',
    requestedByCustomerDate: ''
  });

  // Calculate refund modal
  const [calcRefund, setCalcRefund] = useState(null);
  const [daysBeforeTrip, setDaysBeforeTrip] = useState('');
  const [manualPercentage, setManualPercentage] = useState('');
  const [calcNotes, setCalcNotes] = useState('');

  // Execute refund modal
  const [executeRefund, setExecuteRefund] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('BANK_TRANSFER');

  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const confirm = useConfirm();
  const { formatDate, formatDateTime } = usePreferences();

  const loadData = async () => {
    try {
      setLoading(true);
      const [refRes, reqRes] = await Promise.all([
        api.get('/refunds'),
        api.get('/trip-requests')
      ]);
      setRefunds(refRes || []);
      setTripRequests(reqRes || []);
    } catch (e) {
      toast.error('Failed to load refunds data: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post('/refunds/request', cancelForm);
      toast.success('Cancellation request submitted. Awaiting Master authorization.');
      setShowCancelModal(false);
      setCancelForm({
        tripRequestId: '',
        customerReason: '',
        requestedByCustomerDate: ''
      });
      await loadData();
    } catch (err) {
      toast.error(`Submission error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCalculateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/refunds/${calcRefund.id}/calculate`, {
        daysBeforeTrip: daysBeforeTrip ? parseInt(daysBeforeTrip, 10) : undefined,
        manualPercentage: manualPercentage ? parseFloat(manualPercentage) : undefined,
        notes: calcNotes
      });
      toast.success('Refund calculated successfully. Ready for payout execution.');
      setCalcRefund(null);
      await loadData();
    } catch (err) {
      toast.error(`Calculation error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteSubmit = async (e) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;
    setActionLoading(true);
    try {
      await api.post(`/refunds/${executeRefund.id}/execute`, {
        transactionRef: transactionRef.trim(),
        payoutMethod
      });
      toast.success(`Refund payout of ₹${executeRefund.calculatedRefundAmount?.toLocaleString()} recorded.`);
      setExecuteRefund(null);
      setTransactionRef('');
      await loadData();
    } catch (err) {
      toast.error(`Payout execution error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = refunds.filter((ref) => {
    const matchesStatus = filterStatus === 'ALL' || ref.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      ref.refundId?.toLowerCase().includes(q) ||
      ref.customerName?.toLowerCase().includes(q) ||
      ref.tripRequestId?.toLowerCase().includes(q) ||
      ref.refundTransactionRef?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getRefundActions = (refund) => {
    switch (refund.status) {
      case 'PENDING_CALCULATION':
        return (
          <button
            onClick={() => {
              setCalcRefund(refund);
              setDaysBeforeTrip('');
              setManualPercentage('');
              setCalcNotes('');
            }}
            className="btn-primary py-1 px-3 text-xs"
          >
            <Calculator className="w-3.5 h-3.5" /> Calculate Refund
          </button>
        );
      case 'APPROVED_PENDING_EXECUTION':
        return (
          <button
            onClick={() => {
              setExecuteRefund(refund);
              setTransactionRef('');
            }}
            className="btn-primary py-1 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
          >
            <DollarSign className="w-3.5 h-3.5" /> Execute Payout
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Cancellation & Refund Processing"
        title="Refunds & Cancellations"
        description="Policy-driven refund schedule: 90% (7+ days), 50% (3-6 days), 15% (0-2 days). All payouts require Master authorization."
        icon={AlertCircle}
        actions={
          <button
            onClick={() => setShowCancelModal(true)}
            className="btn-primary text-xs bg-rose-600 hover:bg-rose-700 shadow-soft"
          >
            <Plus className="w-4 h-4" /> Request Cancellation
          </button>
        }
      />

      {/* Policy Reference Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 text-center border-emerald-200/80 bg-emerald-50/40">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">7+ Days Before Departure</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">90%</div>
          <div className="text-xs text-slate-500 mt-0.5">Refund of Total Amount Paid</div>
        </div>
        <div className="card p-4 text-center border-amber-200/80 bg-amber-50/40">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">3-6 Days Before Departure</div>
          <div className="text-3xl font-black text-amber-600 mt-1">50%</div>
          <div className="text-xs text-slate-500 mt-0.5">Provisional Retention Schedule</div>
        </div>
        <div className="card p-4 text-center border-rose-200/80 bg-rose-50/40">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">0-2 Days / Day of Trip</div>
          <div className="text-3xl font-black text-rose-600 mt-1">15%</div>
          <div className="text-xs text-slate-500 mt-0.5">Provisional Late Cancellation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search refund ID, customer, trip request..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'PENDING_MASTER_APPROVAL', label: 'Pending Master Approval' },
            { id: 'PENDING_CALCULATION', label: 'Pending Calculation' },
            { id: 'APPROVED_PENDING_EXECUTION', label: 'Pending Payout' },
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

      {/* Refunds Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Retrieving refund ledger and cancellation tickets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="No cancellation or refund requests found"
            description={search ? 'No refunds matched your search criteria.' : 'All customer accounts are in good standing.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Refund ID</th>
                  <th className="py-3 px-4">Customer &amp; Trip</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Refund Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payout Ref</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">
                      {ref.refundId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ref.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ref.tripRequestId} • {ref.travelDates}</div>
                      <div className="text-[11px] text-slate-500 italic mt-0.5 max-w-sm truncate">"{ref.customerReason}"</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      ₹{ref.amountPaid?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {ref.calculatedRefundAmount > 0 ? (
                        <div>
                          <div className="font-bold text-emerald-700 tabular-nums">₹{ref.calculatedRefundAmount?.toLocaleString()}</div>
                          <div className="text-[11px] text-slate-500">{ref.calculatedPercentage}% of paid</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Pending calculation</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={ref.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {ref.refundTransactionRef || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {getRefundActions(ref)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancellation Request Modal */}
      {showCancelModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCancelModal(false)}
          title="Log Customer Trip Cancellation Request"
          description="Initiates formal cancellation ticket. Moves to Master for executive authorization."
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="cancel-request-form"
                disabled={actionLoading}
                className="btn-primary text-xs bg-rose-600 hover:bg-rose-700"
              >
                {actionLoading ? 'Submitting...' : 'Submit Cancellation'}
              </button>
            </>
          }
        >
          <form id="cancel-request-form" onSubmit={handleCancelSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Trip Request <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={cancelForm.tripRequestId}
                onChange={(e) => setCancelForm({ ...cancelForm, tripRequestId: e.target.value })}
                className="input text-xs"
              >
                <option value="">-- Select Trip Request --</option>
                {tripRequests.map((r) => (
                  <option key={r.tripRequestId} value={r.tripRequestId}>
                    {r.tripRequestId} — {r.customerName} ({r.travelDates})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Request Date
              </label>
              <input
                type="date"
                value={cancelForm.requestedByCustomerDate}
                onChange={(e) => setCancelForm({ ...cancelForm, requestedByCustomerDate: e.target.value })}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason Given by Customer <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={cancelForm.customerReason}
                onChange={(e) => setCancelForm({ ...cancelForm, customerReason: e.target.value })}
                placeholder="e.g. Medical emergency in family / flight rescheduling..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Calculate Refund Modal */}
      {calcRefund && (
        <Modal
          isOpen={true}
          onClose={() => setCalcRefund(null)}
          title={`Calculate Policy Refund: ${calcRefund.refundId}`}
          description={`Customer: ${calcRefund.customerName} • Amount Paid: ₹${calcRefund.amountPaid?.toLocaleString()}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setCalcRefund(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="calc-refund-form"
                disabled={actionLoading}
                className="btn-primary text-xs"
              >
                {actionLoading ? 'Calculating...' : 'Approve Calculated Refund'}
              </button>
            </>
          }
        >
          <form id="calc-refund-form" onSubmit={handleCalculateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Days Notice Before Departure
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10 (auto applies 90%)"
                  value={daysBeforeTrip}
                  onChange={(e) => setDaysBeforeTrip(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Override Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 75"
                  value={manualPercentage}
                  onChange={(e) => setManualPercentage(e.target.value)}
                  className="input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Calculation Notes
              </label>
              <textarea
                rows={2}
                value={calcNotes}
                onChange={(e) => setCalcNotes(e.target.value)}
                placeholder="Deducted unrecoverable boutique stay non-refundable advance..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Execute Payout Modal */}
      {executeRefund && (
        <Modal
          isOpen={true}
          onClose={() => setExecuteRefund(null)}
          title={`Execute Payout: ${executeRefund.refundId}`}
          description={`Customer: ${executeRefund.customerName} • Payout: ₹${executeRefund.calculatedRefundAmount?.toLocaleString()}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setExecuteRefund(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="execute-refund-form"
                disabled={actionLoading || !transactionRef.trim()}
                className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                {actionLoading ? 'Recording...' : 'Confirm Payout Executed'}
              </button>
            </>
          }
        >
          <form id="execute-refund-form" onSubmit={handleExecuteSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payout Method
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="input text-xs"
              >
                <option value="BANK_TRANSFER">Direct Bank Transfer / NEFT / IMPS</option>
                <option value="UPI">UPI VPA Transfer</option>
                <option value="REVERSAL">Gateway Original Source Reversal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Transfer UTR / Transaction Reference <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. CMS58921008432"
                className="input text-xs font-mono"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
