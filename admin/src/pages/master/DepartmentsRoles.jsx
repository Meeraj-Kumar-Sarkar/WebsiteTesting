import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Modal from '../../components/common/Modal';
import { ShieldCheck, Plus, Layers, Shield, Key } from 'lucide-react';

export default function DepartmentsRoles() {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // New Dept Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ code: '', name: '', description: '' });

  // New Role Modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({ departmentCode: 'SALES', code: '', name: '', description: '', permissions: [] });

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptRes, roleRes, permRes] = await Promise.all([
        api.get('/organization/departments'),
        api.get('/organization/roles'),
        api.get('/organization/permissions')
      ]);
      setDepartments(deptRes || []);
      setRoles(roleRes || []);
      setPermissions(permRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      await api.post('/organization/departments', deptForm);
      setFeedback(`Department ${deptForm.name} created successfully.`);
      setShowDeptModal(false);
      setDeptForm({ code: '', name: '', description: '' });
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await api.post('/organization/roles', roleForm);
      setFeedback(`Role ${roleForm.name} created successfully.`);
      setShowRoleModal(false);
      setRoleForm({ departmentCode: 'SALES', code: '', name: '', description: '', permissions: [] });
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Configurable Organization & Capabilities
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Departments, Roles & Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic departments, roles, and granular capability assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeptModal(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Department
          </button>
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Create Role
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Departments Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-600" /> Organization Departments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((d) => (
            <div key={d.code} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="font-mono text-[10px] font-bold text-slate-400">{d.code}</div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{d.name}</div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roles Section */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-600" /> Configured Roles & Assigned Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <div key={r.code} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                    {r.departmentCode}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{r.name}</h3>
                  <div className="text-[11px] text-slate-500 font-mono">{r.code}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600">{r.description}</p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Granted Capabilities ({r.permissions?.includes('*') ? 'All / Wildcard' : r.permissions?.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {r.permissions?.includes('*') ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-800 font-bold">
                      * (Unrestricted Authority)
                    </span>
                  ) : (
                    r.permissions?.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Department Modal */}
      {showDeptModal && (
        <Modal isOpen={true} onClose={() => setShowDeptModal(false)} title="Create New Department">
          <form onSubmit={handleCreateDept} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Department Code (e.g. OPERATIONS)
              </label>
              <input
                type="text"
                required
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                placeholder="OPERATIONS"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Department Display Name
              </label>
              <input
                type="text"
                required
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                placeholder="Ground Operations & Guides"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                placeholder="Department responsibilities and remit..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">
                Create Department
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Role Modal */}
      {showRoleModal && (
        <Modal isOpen={true} onClose={() => setShowRoleModal(false)} title="Create Custom Role">
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={roleForm.departmentCode}
                  onChange={(e) => setRoleForm({ ...roleForm, departmentCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {departments.map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Role Code
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.code}
                  onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value.toUpperCase() })}
                  placeholder="CUSTOM_LEAD"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                required
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="Senior Operations Lead"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Assign Supported Capabilities
              </label>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 space-y-1">
                {permissions.map((p) => {
                  const isChecked = roleForm.permissions.includes(p.code);
                  return (
                    <label key={p.code} className="flex items-center gap-2 p-1 text-xs hover:bg-white rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, p.code] });
                          } else {
                            setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter(x => x !== p.code) });
                          }
                        }}
                        className="rounded text-brand-600"
                      />
                      <span className="font-mono text-[11px] font-semibold text-slate-800">{p.code}</span>
                      <span className="text-[10px] text-slate-500">({p.description})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">
                Save Role
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
