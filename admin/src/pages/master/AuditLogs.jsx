import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { History, Download, Search, Filter, ShieldCheck, User } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/audit-logs');
      setLogs(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleDownloadCsv = async () => {
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
    } catch (err) {
      alert('Failed to download CSV: ' + err.message);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Compliance, Governance & Integrity
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Business Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Append-only record of financial verifications, approval gates, account modifications, and sensitive customer data changes.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV / Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, employee, record ID..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Department:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Departments</option>
            <option value="MASTER">MASTER</option>
            <option value="SALES">SALES</option>
            <option value="FINANCE">FINANCE</option>
            <option value="MARKETING">MARKETING</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Context / Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="font-mono text-slate-400 text-[10px] block">{log.empId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-600">{log.entityType}: <strong>{log.entityId}</strong></span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[10px] max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
