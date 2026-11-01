import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Compass,
  CheckCircle2,
  Users,
  Briefcase,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Package,
  Layers,
  XCircle,
  FileEdit,
  History
} from 'lucide-react';

export default function MasterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'APPROVE', 'REJECT', 'CHANGES'
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [approvalsRes, financeRes, employeesRes, logsRes] = await Promise.all([
        api.get('/approvals'),
        api.get('/finance/dashboard'),
        api.get('/employees'),
        api.get('/reports/audit-logs')
      ]);

      setData({
        tripRequests: approvalsRes.tripRequests || [],
        refundRequests: approvalsRes.refundRequests || [],
        pendingEmployees: employeesRes.filter(e => e.status === 'PENDING_MASTER_APPROVAL'),
        totalEmployees: employeesRes.length,
        finance: financeRes.metrics || {},
        recentLogs: (logsRes || []).slice(0, 8)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleExecuteAction = async () => {
    if (!selectedRequest || !actionModal) return;
    setActionLoading(true);
    setFeedbackMsg('');

    try {
      if (actionModal === 'APPROVE') {
        await api.post(`/approvals/${selectedRequest.id}/approve`, { comments: actionReason });
        setFeedbackMsg(`Green signal granted! Operational Trip created for ${selectedRequest.tripRequestId}.`);
      } else if (actionModal === 'REJECT') {
        await api.post(`/approvals/${selectedRequest.id}/reject`, { reason: actionReason });
        setFeedbackMsg(`Trip Request ${selectedRequest.tripRequestId} was rejected.`);
      } else if (actionModal === 'CHANGES') {
        await api.post(`/approvals/${selectedRequest.id}/request-changes`, { changeNotes: actionReason });
        setFeedbackMsg(`Request returned to Sales with required change notes.`);
      }

      setActionModal(null);
      setSelectedRequest(null);
      setActionReason('');
      await loadDashboard();
    } catch (err) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const awaitingMaster = (data?.tripRequests || []).filter(r => r.status === 'MASTER_REVIEW');
  const pendingRefunds = (data?.refundRequests || []).filter(r => r.status === 'PENDING_MASTER_APPROVAL');

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-700 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Executive Command & Oversight
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Master / Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time cross-department authority, financial status, and high-impact approval gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/master/approvals"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approval Gateway ({awaitingMaster.length + pendingRefunds.length})
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg('')} className="text-emerald-600 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Awaiting Master Review"
          value={awaitingMaster.length}
          subtitle="Trip requests requiring green signal"
          icon={CheckCircle2}
          color="purple"
          badgeText={awaitingMaster.length > 0 ? 'Action Needed' : 'Clear'}
        />

        <StatCard
          title="Total Invoiced / Sales"
          value={`₹${(data?.finance?.totalInvoiced || 0).toLocaleString()}`}
          subtitle={`₹${(data?.finance?.amountCollected || 0).toLocaleString()} verified in bank`}
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title="Projected Gross Margin"
          value={`₹${(data?.finance?.projectedGrossMargin || 0).toLocaleString()}`}
          subtitle={`${data?.finance?.marginPercentage || 0}% average projected yield`}
          icon={TrendingUp}
          color="blue"
        />

        <StatCard
          title="Registrations & Staff"
          value={data?.totalEmployees || 0}
          subtitle={`${data?.pendingEmployees?.length || 0} pending account activations`}
          icon={Users}
          color="amber"
          badgeText={data?.pendingEmployees?.length > 0 ? `${data?.pendingEmployees?.length} Pending` : 'Verified'}
        />
      </div>

      {/* Executive Approval Priority Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              High-Impact Approval Queue
            </h2>
          </div>
          <Link to="/master/approvals" className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1">
            View full queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {awaitingMaster.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            No trip requests are currently awaiting executive approval.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/75 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Customer & Package</th>
                  <th className="py-3 px-4">Travel Dates</th>
                  <th className="py-3 px-4">Agreed Amount</th>
                  <th className="py-3 px-4">Finance Status</th>
                  <th className="py-3 px-4 text-right">Master Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {awaitingMaster.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {req.tripRequestId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{req.customerName}</div>
                      <div className="text-[11px] text-slate-500">{req.packageName} ({req.travellerCount} pax)</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {req.travelDates}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{req.agreedAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Payment Verified
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionModal('APPROVE');
                          setActionReason('Approved following complete payment verification and acceptable margin.');
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
                      >
                        Green Signal
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionModal('CHANGES');
                          setActionReason('');
                        }}
                        className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium text-xs transition border border-amber-300"
                      >
                        Request Changes
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionModal('REJECT');
                          setActionReason('');
                        }}
                        className="px-2.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium text-xs transition border border-rose-300"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Layout: Pending Staff Activations & Recent Audit Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Employee Registrations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                New Registrations Awaiting Activation ({data?.pendingEmployees?.length || 0})
              </h3>
            </div>
            <Link to="/master/employees" className="text-xs text-brand-600 hover:underline font-medium">
              Manage Staff
            </Link>
          </div>

          {data?.pendingEmployees?.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No pending registrations. All employee accounts are verified.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data?.pendingEmployees?.map((emp) => (
                <div key={emp.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{emp.fullName}</div>
                    <div className="text-[11px] text-slate-500">{emp.email} • {emp.phone}</div>
                    <div className="text-[10px] font-mono text-brand-700 mt-0.5">{emp.empId}</div>
                  </div>
                  <Link
                    to="/master/employees"
                    className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-semibold text-xs"
                  >
                    Activate & Assign
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Cross-Department Audit Trail */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recent Audit Trail (Immutable)
              </h3>
            </div>
            <Link to="/master/audit-logs" className="text-xs text-brand-600 hover:underline font-medium">
              View All Logs
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {data?.recentLogs?.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    <span className="font-mono text-[10px] text-slate-500 mr-1.5">{log.empId}</span>
                    {log.action}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Target: <span className="font-mono">{log.entityType} ({log.entityId})</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {actionModal && selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => setActionModal(null)}
          title={`Master Decision: ${actionModal === 'APPROVE' ? 'Grant Supplier Booking Clearance' : actionModal === 'REJECT' ? 'Reject Trip Request' : 'Request Sales Adjustments'}`}
        >
          <div className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
              <div><strong className="text-slate-900">Request:</strong> {selectedRequest.tripRequestId} ({selectedRequest.customerName})</div>
              <div><strong className="text-slate-900">Package:</strong> {selectedRequest.packageName} ({selectedRequest.travelDates})</div>
              <div><strong className="text-slate-900">Agreed Price:</strong> ₹{selectedRequest.agreedAmount?.toLocaleString()}</div>
            </div>

            {actionModal === 'APPROVE' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <strong>Executive Action:</strong> Granting this clearance transitions the trip request to <code>APPROVED_FOR_SUPPLIER_BOOKING</code> and activates operational trip record for transport and hotel reservations.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                {actionModal === 'APPROVE' ? 'Executive Notes / Approval Comments' : 'Reason / Required Changes (Mandatory)'}
              </label>
              <textarea
                rows={3}
                required={actionModal !== 'APPROVE'}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter specific guidance or justification..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || (actionModal !== 'APPROVE' && !actionReason.trim())}
                onClick={handleExecuteAction}
                className={`px-4 py-2 rounded-lg text-white text-xs font-semibold shadow transition disabled:opacity-50 ${
                  actionModal === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  actionModal === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {actionLoading ? 'Processing...' : `Confirm ${actionModal}`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
