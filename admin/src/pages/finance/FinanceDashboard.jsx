import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { PageLoader } from '../../components/common/Loaders';
import { usePreferences } from '../../context/PreferencesContext';
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Wallet
} from 'lucide-react';

export default function FinanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatDate } = usePreferences();

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

  if (loading && !data) {
    return <PageLoader />;
  }

  const metrics = data?.metrics || {};
  const awaitingVerification = data?.awaitingVerification || [];
  const overdueInvoices = data?.overdueInvoices || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Financial Oversight & Cashflow"
        title="Finance & Accounts Dashboard"
        description="Operational cash collections, manual bank reconciliation, payment requests, and verified refund payouts."
        icon={Wallet}
        actions={
          <Link
            to="/finance/payments"
            className="btn-primary text-xs"
          >
            <CreditCard className="w-4 h-4" /> Verify Payments ({metrics.paymentsAwaitingVerificationCount || 0})
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Awaiting Verification"
          value={metrics.paymentsAwaitingVerificationCount || 0}
          subtitle="Transactions needing bank reconciliation"
          icon={CreditCard}
          color="amber"
          badgeText={metrics.paymentsAwaitingVerificationCount > 0 ? 'Action Needed' : 'Reconciled'}
        />

        <StatCard
          title="Total Invoiced"
          value={`₹${(metrics.totalInvoiced || 0).toLocaleString()}`}
          subtitle={`₹${(metrics.outstandingReceivables || 0).toLocaleString()} receivables due`}
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
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Payments Awaiting Verification ({awaitingVerification.length})
              </h2>
            </div>
            <Link to="/finance/payments" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              Open Desk <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {awaitingVerification.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              All customer payments have been reconciled with actual bank statements.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {awaitingVerification.map((pay) => (
                <div key={pay.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{pay.paymentId}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold">
                        {pay.method}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 mt-0.5 tabular-nums">₹{pay.amount?.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500 font-mono">UTR: {pay.transactionRef}</div>
                  </div>
                  <Link
                    to="/finance/payments"
                    className="btn-primary py-1 px-3 text-xs"
                  >
                    Verify
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Invoices */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Overdue Payment Requests ({overdueInvoices.length})
              </h2>
            </div>
            <Link to="/finance/invoices" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              All Invoices <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {overdueInvoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No overdue payment requests.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {overdueInvoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-rose-700">{inv.invoiceId}</div>
                    <div className="font-bold text-slate-900">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-500">
                      Balance: <strong className="text-rose-600 tabular-nums">₹{inv.balanceDue?.toLocaleString()}</strong> • Due: {inv.dueDate ? formatDate(inv.dueDate) : 'Immediate'}
                    </div>
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
