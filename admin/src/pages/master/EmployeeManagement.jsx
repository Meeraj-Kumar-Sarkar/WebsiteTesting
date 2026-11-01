import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Slash,
  AlertTriangle,
  UserPlus,
  Edit2,
  CheckCircle2,
  Search
} from 'lucide-react';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [feedback, setFeedback] = useState('');

  // Status Change Modal
  const [statusModalEmp, setStatusModalEmp] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Role Assignment Modal
  const [assignModalEmp, setAssignModalEmp] = useState(null);
  const [selectedMemberships, setSelectedMemberships] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes, roleRes] = await Promise.all([
        api.get('/employees'),
        api.get('/organization/departments'),
        api.get('/organization/roles')
      ]);
      setEmployees(empRes || []);
      setDepartments(deptRes || []);
      setRoles(roleRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleStatusSubmit = async () => {
    if (!statusModalEmp || !targetStatus) return;
    setStatusLoading(true);
    try {
      await api.patch(`/employees/${statusModalEmp.id}/status`, {
        status: targetStatus,
        reason: statusReason
      });
      setFeedback(`Status updated for ${statusModalEmp.fullName} to ${targetStatus}.`);
      setStatusModalEmp(null);
      setStatusReason('');
      await loadAll();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAssignRolesSubmit = async () => {
    if (!assignModalEmp || selectedMemberships.length === 0) return;
    setAssignLoading(true);
    try {
      await api.post(`/employees/${assignModalEmp.id}/assign-roles`, {
        memberships: selectedMemberships
      });
      setFeedback(`Assigned roles updated for ${assignModalEmp.fullName}.`);
      setAssignModalEmp(null);
      await loadAll();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setAssignLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.empId?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.departments?.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <Users className="w-4 h-4 text-brand-600" />
            Human Resources & Governance
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Employee Directory & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee registrations, security states (Freeze/Suspend/Block), and role assignments.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Full Name & Contact</th>
                <th className="py-3 px-4">Departments</th>
                <th className="py-3 px-4">Assigned Roles</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    {emp.empId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{emp.fullName}</div>
                    <div className="text-[11px] text-slate-500">{emp.email} • {emp.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {emp.departments?.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[11px] text-slate-600">
                      {emp.roles?.map(r => r.roleName || r.roleCode).join(', ') || <span className="text-slate-400 italic">None</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={emp.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setAssignModalEmp(emp);
                        setSelectedMemberships(
                          emp.roles?.map(r => ({ departmentCode: r.departmentCode, roleCode: r.roleCode })) || []
                        );
                      }}
                      className="px-2.5 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200 transition"
                    >
                      Assign Roles
                    </button>

                    <button
                      onClick={() => {
                        setStatusModalEmp(emp);
                        setTargetStatus(emp.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200 transition"
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      {statusModalEmp && (
        <Modal
          isOpen={true}
          onClose={() => setStatusModalEmp(null)}
          title={`Update Account Status: ${statusModalEmp.fullName} (${statusModalEmp.empId})`}
        >
          <div className="space-y-4">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
              <strong>Account Protection Notice:</strong>
              <p>Security rules prevent deactivating or blocking the last remaining active Master account.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Select New Status
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE (Full assigned access)</option>
                <option value="FROZEN">FROZEN (Temporary freeze, login disabled)</option>
                <option value="SUSPENDED">SUSPENDED (Pending review)</option>
                <option value="BLOCKED">BLOCKED (Administratively blocked)</option>
                <option value="DEACTIVATED">DEACTIVATED (Employment ended)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Reason / Administrative Justification
              </label>
              <textarea
                rows={2}
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Reason for changing status (logged to security audit)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStatusModalEmp(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={statusLoading}
                onClick={handleStatusSubmit}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow transition disabled:opacity-50"
              >
                {statusLoading ? 'Updating...' : 'Confirm Status Change'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Role Assignment Modal */}
      {assignModalEmp && (
        <Modal
          isOpen={true}
          onClose={() => setAssignModalEmp(null)}
          title={`Assign Department & Roles: ${assignModalEmp.fullName}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Select department roles for this employee. Activating and assigning a pending registration grants immediate access to the respective department workspaces.
            </p>

            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
              {roles.map((r) => {
                const isSelected = selectedMemberships.some(m => m.departmentCode === r.departmentCode && m.roleCode === r.code);
                return (
                  <label key={r.code} className="flex items-start gap-2.5 p-2 rounded hover:bg-white cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMemberships([...selectedMemberships, { departmentCode: r.departmentCode, roleCode: r.code }]);
                        } else {
                          setSelectedMemberships(selectedMemberships.filter(m => !(m.departmentCode === r.departmentCode && m.roleCode === r.code)));
                        }
                      }}
                      className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{r.name} <span className="font-mono text-slate-500 text-[10px]">({r.departmentCode})</span></div>
                      <div className="text-slate-500 text-[11px]">{r.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAssignModalEmp(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assignLoading || selectedMemberships.length === 0}
                onClick={handleAssignRolesSubmit}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow transition disabled:opacity-50"
              >
                {assignLoading ? 'Saving...' : 'Save & Activate Account'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
