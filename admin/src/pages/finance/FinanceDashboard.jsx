import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function FinanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/finance/dashboard');
      setData(res || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = data?.metrics || {};
  const awaitingVerification = data?.awaitingVerification || [];
  const overdueInvoices = data?.overdueInvoices || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Financial Oversight & Cashflow
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Finance & Accounts Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational cash collections, manual bank reconciliation, payment requests, and verified refund payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/finance/payments"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" /> Verify Payments ({metrics.paymentsAwaitingVerificationCount || 0})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Awaiting Verification"
          value={metrics.paymentsAwaitingVerificationCount || 0}
          subtitle="Transactions needing bank reconciliation"
          icon={CreditCard}
          color="amber"
          badgeText={metrics.paymentsAwaitingVerificationCount > 0 ? 'Review Needed' : 'Cleared'}
        />

        <StatCard
          title="Total Invoiced"
          value={`₹${(metrics.totalInvoiced || 0).toLocaleString()}`}
          subtitle={`₹${(metrics.outstandingReceivables || 0).toLocaleString()} outstanding receivables`}
          icon={FileText}
          color="blue"
        />

        <StatCard
          title="Verified Collections"
          value={`₹${(metrics.amountCollected || 0).toLocaleString()}`}
          subtitle="Confirmed receipt in bank/UPI accounts"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Gross Margin Yield"
          value={`₹${(metrics.projectedGrossMargin || 0).toLocaleString()}`}
          subtitle={`${metrics.marginPercentage || 0}% projected trip margin`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Payments to Verify vs Overdue Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payments Awaiting Reconciliation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Payments Awaiting Verification ({awaitingVerification.length})
              </h2>
            </div>
            <Link to="/finance/payments" className="text-xs text-brand-600 font-semibold hover:underline">
              Open Queue
            </Link>
          </div>

          {awaitingVerification.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              All customer payments have been reconciled with bank records.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {awaitingVerification.map(pay => (
                <div key={pay.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{pay.paymentId}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {pay.method}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 mt-0.5">₹{pay.amount?.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500 font-mono">UTR: {pay.transactionRef}</div>
                  </div>
                  <Link
                    to="/finance/payments"
                    className="px-3 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Verify
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Overdue Payment Requests ({overdueInvoices.length})
              </h2>
            </div>
            <Link to="/finance/invoices" className="text-xs text-brand-600 font-semibold hover:underline">
              All Invoices
            </Link>
          </div>

          {overdueInvoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No overdue payment requests.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {overdueInvoices.map(inv => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-rose-700">{inv.invoiceId}</div>
                    <div className="font-bold text-slate-900">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-500">Balance: ₹{inv.balanceDue?.toLocaleString()} • Due: {inv.dueDate}</div>
                  </div>
                  <Badge status="UNPAID" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
