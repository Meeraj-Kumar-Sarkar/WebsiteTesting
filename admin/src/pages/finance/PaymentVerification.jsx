import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Check,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');

  // Reject Modal
  const [rejectPay, setRejectPay] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      setPayments(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleVerify = async (payment) => {
    if (!window.confirm(`Confirm verification of ₹${payment.amount.toLocaleString()} (UTR: ${payment.transactionRef}) against actual bank statement?`)) {
      return;
    }
    try {
      await api.post(`/payments/${payment.id}/verify`, {});
      setFeedback(`Payment ${payment.paymentId} verified and reconciled. Master notified.`);
      await loadPayments();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectPay || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await api.post(`/payments/${rejectPay.id}/reject`, { reason: rejectReason });
      setFeedback(`Payment ${rejectPay.paymentId} marked as rejected. Reason dispatched to Sales.`);
      setRejectPay(null);
      setRejectReason('');
      await loadPayments();
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = payments.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.paymentId?.toLowerCase().includes(q) ||
      p.invoiceId?.toLowerCase().includes(q) ||
      p.transactionRef?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-1">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Bank & UPI Reconciliation
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Payment Verification Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule: Customer screenshots or QR scans are not proof of receipt. Finance verifies actual bank deposits before clearing trip requests.
          </p>
        </div>
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
            placeholder="Search payment ID, invoice, UTR..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'PENDING_VERIFICATION' ? 'Awaiting Verification' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Linked Invoice</th>
                <th className="py-3 px-4">Trip Request</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4">Method & UTR Reference</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Finance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    {pay.paymentId}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {pay.invoiceId}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {pay.tripRequestId}
                  </td>
                  <td className="py-3 px-4 font-black text-sm text-slate-900">
                    ₹{pay.amount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold">
                      {pay.method}
                    </span>
                    <div className="font-mono text-slate-800 font-bold mt-0.5">UTR: {pay.transactionRef}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={pay.status} />
                    {pay.rejectionReason && (
                      <span className="block text-[10px] text-rose-600 mt-0.5 italic">
                        Reason: {pay.rejectionReason}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {pay.status === 'PENDING_VERIFICATION' ? (
                      <>
                        <button
                          onClick={() => handleVerify(pay)}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Verify Deposit
                        </button>
                        <button
                          onClick={() => setRejectPay(pay)}
                          className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-xs transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {pay.verifiedBy ? `By ${pay.verifiedBy}` : 'Reconciled'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Payment Modal */}
      {rejectPay && (
        <Modal
          isOpen={true}
          onClose={() => setRejectPay(null)}
          title={`Reject Payment: ${rejectPay.paymentId}`}
        >
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
              <strong>Bank Statement Reconciliation Failure:</strong>
              <p>State clearly why this payment was not verified (e.g. UTR not matching statement, amount mismatch, reversed charge).</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Rejection Reason (Mandatory)
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR 631109884210 not found in HDFC account statement on 2026-11-01..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setRejectPay(null)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading || !rejectReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
