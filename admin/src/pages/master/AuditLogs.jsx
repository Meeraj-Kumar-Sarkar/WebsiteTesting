import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast } from '../../context/FeedbackContext';
import { usePreferences } from '../../context/PreferencesContext';
import { History, Download, Search, Filter, ShieldCheck, User } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('ALL');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const toast = useToast();
  const { formatDateTime } = usePreferences();

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/audit-logs');
      setLogs(res || []);
    } catch (e) {
      toast.error('Failed to load audit logs: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleDownloadCsv = async () => {
    setExporting(true);
    try {
      const csvText = await api.get('/reports/audit-logs/export');
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mountain-memories-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Audit ledger exported to CSV file.');
    } catch (err) {
      toast.error('Failed to download CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const filtered = logs.filter((log) => {
    const matchesDept = filterDept === 'ALL' || log.department === filterDept;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      log.action?.toLowerCase().includes(q) ||
      log.actorName?.toLowerCase().includes(q) ||
      log.empId?.toLowerCase().includes(q) ||
      log.entityId?.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Compliance, Governance & Integrity"
        title="Business Audit Logs"
        description="Immutable ledger recording financial verifications, executive approvals, role assignments, and customer modifications."
        icon={History}
        actions={
          <button
            onClick={handleDownloadCsv}
            disabled={exporting}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> {exporting ? 'Exporting...' : 'Export CSV / Excel'}
          </button>
        }
      />

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, employee name, entity ID..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Department:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="input text-xs w-44"
          >
            <option value="ALL">All Workspaces</option>
            <option value="MASTER">MASTER</option>
            <option value="SALES">SALES</option>
            <option value="FINANCE">FINANCE</option>
            <option value="MARKETING">MARKETING</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Loading audit trail entries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={History}
            title="No audit entries found"
            description={search ? 'No log entries matched your search criteria.' : 'Audit trail is currently clear.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Context / Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      <span className="font-mono text-slate-400 text-[10px] block">{log.empId}</span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-brand-700">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="text-slate-600">{log.entityType}: <strong>{log.entityId}</strong></span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[10px] max-w-sm truncate" title={log.details ? JSON.stringify(log.details) : ''}>
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
