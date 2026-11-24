import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast } from '../../context/FeedbackContext';
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
  Search,
  ShieldCheck
} from 'lucide-react';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Status Change Modal
  const [statusModalEmp, setStatusModalEmp] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Role Assignment Modal
  const [assignModalEmp, setAssignModalEmp] = useState(null);
  const [selectedMemberships, setSelectedMemberships] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const toast = useToast();

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
      toast.error('Failed to load employee records: ' + err.message);
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
      toast.success(`Status updated for ${statusModalEmp.fullName} to ${targetStatus}.`);
      setStatusModalEmp(null);
      setStatusReason('');
      await loadAll();
    } catch (err) {
      toast.error(`Status update error: ${err.message}`);
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
      toast.success(`Assigned roles updated for ${assignModalEmp.fullName}.`);
      setAssignModalEmp(null);
      await loadAll();
    } catch (err) {
      toast.error(`Role assignment error: ${err.message}`);
    } finally {
      setAssignLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.empId?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.departments?.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Human Resources & Governance"
        title="Employee Directory & Access Control"
        description="Manage employee registrations, security states (Freeze / Suspend / Block), and role assignments across workspaces."
        icon={Users}
      />

      {/* Filters and search */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, employee ID, or email..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="input text-xs w-44"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Loading enterprise user directory...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No employees found"
            description={search ? 'No users matched your filter criteria.' : 'Employee directory is empty.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Full Name &amp; Contact</th>
                  <th className="py-3 px-4">Departments</th>
                  <th className="py-3 px-4">Assigned Roles</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {emp.empId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{emp.email} • {emp.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.departments?.map((d) => (
                          <span key={d} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-slate-600">
                        {emp.roles?.map((r) => r.roleName || r.roleCode).join(', ') || <span className="text-slate-400 italic">None</span>}
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
                            emp.roles?.map((r) => ({ departmentCode: r.departmentCode, roleCode: r.roleCode })) || []
                          );
                        }}
                        className="btn-secondary py-1 px-2.5 text-xs text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100"
                      >
                        Assign Roles
                      </button>

                      <button
                        onClick={() => {
                          setStatusModalEmp(emp);
                          setTargetStatus(emp.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE');
                        }}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {statusModalEmp && (
        <Modal
          isOpen={true}
          onClose={() => setStatusModalEmp(null)}
          title={`Update Account Status: ${statusModalEmp.fullName} (${statusModalEmp.empId})`}
          description="Adjust security standing or freeze login privileges for this employee."
          footer={
            <>
              <button
                type="button"
                onClick={() => setStatusModalEmp(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={statusLoading}
                onClick={handleStatusSubmit}
                className="btn-primary text-xs"
              >
                {statusLoading ? 'Updating...' : 'Confirm Status Change'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
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
                className="input text-xs"
              >
                <option value="ACTIVE">ACTIVE — Normal operational clearance</option>
                <option value="FROZEN">FROZEN — Temporary restriction</option>
                <option value="SUSPENDED">SUSPENDED — Audit or investigation hold</option>
                <option value="BLOCKED">BLOCKED — Complete administrative block</option>
                <option value="DEACTIVATED">DEACTIVATED — Separated or retired employee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Administrative Reason
              </label>
              <textarea
                rows={2}
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Reason for freezing, unblocking, or changing status..."
                className="input resize-none text-xs"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Role Assignment Modal */}
      {assignModalEmp && (
        <Modal
          isOpen={true}
          onClose={() => setAssignModalEmp(null)}
          title={`Assign Roles: ${assignModalEmp.fullName}`}
          description={`Employee ID: ${assignModalEmp.empId}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setAssignModalEmp(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assignLoading || selectedMemberships.length === 0}
                onClick={handleAssignRolesSubmit}
                className="btn-primary text-xs"
              >
                {assignLoading ? 'Saving...' : 'Save Role Assignments'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Select department-level roles to assign to this employee. Users with MASTER workspace membership have unrestricted system clearance.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {departments.map((dept) => {
                const deptRoles = roles.filter((r) => r.departmentCode === dept.code);
                return (
                  <div key={dept.code} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block">
                      {dept.name} ({dept.code})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {deptRoles.map((role) => {
                        const isChecked = selectedMemberships.some(
                          (m) => m.departmentCode === dept.code && m.roleCode === role.code
                        );
                        return (
                          <label key={role.code} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMemberships([
                                    ...selectedMemberships,
                                    { departmentCode: dept.code, roleCode: role.code }
                                  ]);
                                } else {
                                  setSelectedMemberships(
                                    selectedMemberships.filter(
                                      (m) => !(m.departmentCode === dept.code && m.roleCode === role.code)
                                    )
                                  );
                                }
                              }}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span>{role.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
