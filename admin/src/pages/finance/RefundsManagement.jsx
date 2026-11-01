import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  AlertCircle,
  Plus,
  CheckCircle2,
  XCircle,
  Calculator,
  DollarSign,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function RefundsManagement() {
  const [refunds, setRefunds] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

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
      console.error(e);
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
      setFeedback('Cancellation request submitted. Awaiting Master authorization.');
      setShowCancelModal(false);
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCalculateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/refunds/${calcRefund.id}/calculate`, {
        daysBeforeTrip: daysBeforeTrip ? parseInt(daysBeforeTrip) : undefined,
        manualPercentage: manualPercentage ? parseFloat(manualPercentage) : undefined,
        notes: calcNotes
      });
      setFeedback(`Refund calculated successfully. Ready for payout execution.`);
      setCalcRefund(null);
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/refunds/${executeRefund.id}/execute`, {
        transactionRef,
        payoutMethod
      });
      setFeedback(`Refund payout of ₹${executeRefund.calculatedRefundAmount?.toLocaleString()} recorded with UTR: ${transactionRef}`);
      setExecuteRefund(null);
      setTransactionRef('');
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

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
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
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
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
          >
            <DollarSign className="w-3.5 h-3.5" /> Execute Payout
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-700 font-bold mb-1">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Cancellation & Refund Processing
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Refunds & Cancellations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Policy-driven refund schedule: 90% (7+ days), 50% (3-6 days), 15% (0-2 days). All payouts require Master authorization.
          </p>
        </div>

        <button
          onClick={() => setShowCancelModal(true)}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Request Cancellation
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Policy Reference Panel */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
          <div className="text-xs font-bold text-slate-500 uppercase">7+ Days Before Trip</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">90%</div>
          <div className="text-[11px] text-slate-500">Refund of Amount Paid</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
          <div className="text-xs font-bold text-slate-500 uppercase">3-6 Days Before Trip</div>
          <div className="text-2xl font-black text-amber-600 mt-1">50%</div>
          <div className="text-[11px] text-slate-500">Provisional Refund</div>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
          <div className="text-xs font-bold text-slate-500 uppercase">0-2 Days / Day of Trip</div>
          <div className="text-2xl font-black text-rose-600 mt-1">15%</div>
          <div className="text-[11px] text-slate-500">Provisional Refund</div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {refunds.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            No cancellation or refund requests recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Refund ID</th>
                  <th className="py-3 px-4">Customer & Trip</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Refund Calculated</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payout Ref</th>
                  <th className="py-3 px-4 text-right">Finance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">
                      {ref.refundId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ref.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ref.tripRequestId} • {ref.travelDates}</div>
                      <div className="text-[11px] text-slate-500 italic mt-0.5">"{ref.customerReason}"</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{ref.amountPaid?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {ref.calculatedRefundAmount > 0 ? (
                        <div>
                          <div className="font-bold text-emerald-700">₹{ref.calculatedRefundAmount?.toLocaleString()}</div>
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

      {/* Request Cancellation Modal */}
      {showCancelModal && (
        <Modal isOpen={true} onClose={() => setShowCancelModal(false)} title="Lodge Customer Cancellation Request">
          <form onSubmit={handleCancelSubmit} className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
              <strong>Cancellation Workflow:</strong>
              <p>Sales logs the customer's request → Master authorizes cancellation → Finance calculates policy refund → Finance executes bank transfer → Confirmed payout.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Trip Request to Cancel
              </label>
              <select
                required
                value={cancelForm.tripRequestId}
                onChange={(e) => setCancelForm({ ...cancelForm, tripRequestId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
              >
                <option value="">-- Select Trip Request --</option>
                {tripRequests
                  .filter(r => !['CANCELLED', 'DRAFT', 'REJECTED'].includes(r.status))
                  .map(r => (
                    <option key={r.tripRequestId} value={r.tripRequestId}>
                      {r.tripRequestId} — {r.customerName} ({r.travelDates})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Customer's Stated Reason for Cancellation
              </label>
              <textarea
                rows={2}
                required
                value={cancelForm.customerReason}
                onChange={(e) => setCancelForm({ ...cancelForm, customerReason: e.target.value })}
                placeholder="e.g. Medical emergency, family obligation, dates changed..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Customer Requested Cancellation On
              </label>
              <input
                type="date"
                value={cancelForm.requestedByCustomerDate}
                onChange={(e) => setCancelForm({ ...cancelForm, requestedByCustomerDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50">
                {actionLoading ? 'Submitting...' : 'Submit Cancellation Request'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Calculate Refund Modal */}
      {calcRefund && (
        <Modal isOpen={true} onClose={() => setCalcRefund(null)} title={`Calculate Refund: ${calcRefund.refundId}`}>
          <form onSubmit={handleCalculateSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div><strong>Customer:</strong> {calcRefund.customerName}</div>
              <div><strong>Amount Paid:</strong> ₹{calcRefund.amountPaid?.toLocaleString()}</div>
              <div><strong>Travel Dates:</strong> {calcRefund.travelDates}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Days Before Trip (for auto policy lookup)
              </label>
              <input
                type="number"
                value={daysBeforeTrip}
                onChange={(e) => {
                  setDaysBeforeTrip(e.target.value);
                  setManualPercentage('');
                }}
                placeholder="e.g. 8 (will apply 90% policy)"
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="text-xs text-slate-500 text-center">— or override with manual percentage —</div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Manual Override Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={manualPercentage}
                onChange={(e) => {
                  setManualPercentage(e.target.value);
                  setDaysBeforeTrip('');
                }}
                placeholder="e.g. 75"
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            {(daysBeforeTrip || manualPercentage) && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <strong>Preview:</strong> ₹{(
                  calcRefund.amountPaid * (
                    (parseFloat(manualPercentage) || (parseInt(daysBeforeTrip) >= 7 ? 90 : parseInt(daysBeforeTrip) >= 3 ? 50 : 15)) / 100
                  )
                ).toLocaleString()} refund ({manualPercentage || (parseInt(daysBeforeTrip) >= 7 ? 90 : parseInt(daysBeforeTrip) >= 3 ? 50 : 15)}%)
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Notes</label>
              <textarea rows={2} value={calcNotes} onChange={(e) => setCalcNotes(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setCalcRefund(null)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
              <button type="submit" disabled={actionLoading || (!daysBeforeTrip && !manualPercentage)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50">
                {actionLoading ? 'Calculating...' : 'Set Refund Amount'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Execute Payout Modal */}
      {executeRefund && (
        <Modal isOpen={true} onClose={() => setExecuteRefund(null)} title={`Record Refund Payout: ${executeRefund.refundId}`}>
          <form onSubmit={handleExecuteSubmit} className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
              <div><strong>Customer:</strong> {executeRefund.customerName}</div>
              <div><strong>Refund Amount:</strong> <span className="font-black text-emerald-700">₹{executeRefund.calculatedRefundAmount?.toLocaleString()}</span> ({executeRefund.calculatedPercentage}%)</div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Payout Method</label>
              <select value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs bg-white">
                <option value="BANK_TRANSFER">Bank Transfer / NEFT / IMPS</option>
                <option value="UPI">UPI Transfer</option>
                <option value="CHEQUE">Account Payee Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Bank Transfer / UTR Reference (Mandatory)
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. NEFT/HDFC/20261101/002891"
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setExecuteRefund(null)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button>
              <button type="submit" disabled={actionLoading || !transactionRef.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50">
                {actionLoading ? 'Recording...' : 'Confirm Payout Executed'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
