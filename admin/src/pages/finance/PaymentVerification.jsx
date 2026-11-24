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
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Check,
  ShieldCheck,
  DollarSign,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  
  // Reject Modal
  const [rejectPay, setRejectPay] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const confirm = useConfirm();
  const { formatDate, formatDateTime } = usePreferences();

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      setPayments(res || []);
    } catch (e) {
      toast.error('Failed to load payments: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleVerify = async (payment) => {
    const ok = await confirm({
      title: 'Verify Bank Deposit?',
      message: `Confirm that ₹${payment.amount.toLocaleString()} (UTR: ${payment.transactionRef}) has definitively settled into the bank account?`,
      confirmText: 'Verify & Reconcile',
      tone: 'default'
    });
    if (!ok) return;

    try {
      await api.post(`/payments/${payment.id}/verify`, {});
      toast.success(`Payment ${payment.paymentId} verified and reconciled.`);
      await loadPayments();
    } catch (err) {
      toast.error('Verification failed: ' + err.message);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectPay || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await api.post(`/payments/${rejectPay.id}/reject`, { reason: rejectReason.trim() });
      toast.success(`Payment ${rejectPay.paymentId} marked as rejected. Notified Sales.`);
      setRejectPay(null);
      setRejectReason('');
      await loadPayments();
    } catch (err) {
      toast.error('Rejection failed: ' + err.message);
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
      p.tripRequestId?.toLowerCase().includes(q) ||
      p.transactionRef?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = payments.filter(p => p.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Finance & Treasury Desk"
        title="Payment Verification"
        description="Verify actual bank statements against reported customer UPI, QR, and wire references before clearing trip itineraries."
        icon={CreditCard}
        actions={
          pendingCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {pendingCount} Awaiting Verification
            </div>
          )
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
            placeholder="Search payment ID, invoice, trip request, UTR..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'PENDING_VERIFICATION', label: 'Pending Verification' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'REJECTED', label: 'Rejected' },
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

      {/* Verification Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Retrieving payment reconciliation ledger...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payment records found"
            description={search ? 'No payments matched your search query.' : 'There are currently no payments recorded under this filter.'}
            action={
              search && (
                <button onClick={() => setSearch('')} className="btn-secondary text-xs">
                  Clear Search
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Linked Invoice</th>
                  <th className="py-3 px-4">Trip Request</th>
                  <th className="py-3 px-4">Amount (INR)</th>
                  <th className="py-3 px-4">Method &amp; UTR</th>
                  <th className="py-3 px-4">Date Reported</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {pay.paymentId}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {pay.invoiceId}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {pay.tripRequestId}
                    </td>
                    <td className="py-3 px-4 font-black text-sm text-slate-900 tabular-nums">
                      ₹{pay.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-semibold">
                        {pay.method}
                      </span>
                      <div className="font-mono text-slate-900 font-bold mt-1">UTR: {pay.transactionRef}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(pay.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={pay.status} />
                      {pay.rejectionReason && (
                        <span className="block text-[10px] text-rose-600 mt-1 italic max-w-xs truncate">
                          Reason: {pay.rejectionReason}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {pay.status === 'PENDING_VERIFICATION' ? (
                        <>
                          <button
                            onClick={() => handleVerify(pay)}
                            className="btn-primary py-1 px-3 text-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Verify Deposit
                          </button>
                          <button
                            onClick={() => {
                              setRejectPay(pay);
                              setRejectReason('');
                            }}
                            className="btn-secondary py-1 px-2.5 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300"
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
        )}
      </div>

      {/* Reject Payment Modal */}
      {rejectPay && (
        <Modal
          isOpen={true}
          onClose={() => setRejectPay(null)}
          title={`Reject Payment: ${rejectPay.paymentId}`}
          description={`Amount: ₹${rejectPay.amount?.toLocaleString()} • UTR: ${rejectPay.transactionRef}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setRejectPay(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="reject-payment-form"
                disabled={actionLoading || !rejectReason.trim()}
                className="btn py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          }
        >
          <form id="reject-payment-form" onSubmit={handleRejectSubmit} className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              <strong>Bank Statement Reconciliation Failure:</strong>
              <p>State clearly why this payment was not verified (e.g. UTR not matching statement, amount mismatch, reversed charge).</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rejection Reason (Mandatory)
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR 631109884210 not found in HDFC account statement on 2026-11-01..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
