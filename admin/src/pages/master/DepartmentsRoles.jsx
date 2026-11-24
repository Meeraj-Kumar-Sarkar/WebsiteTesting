import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast } from '../../context/FeedbackContext';
import { ShieldCheck, Plus, Layers, Shield, Key } from 'lucide-react';

export default function DepartmentsRoles() {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Dept Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ code: '', name: '', description: '' });
  const [deptLoading, setDeptLoading] = useState(false);

  // New Role Modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({ departmentCode: 'SALES', code: '', name: '', description: '', permissions: [] });
  const [roleLoading, setRoleLoading] = useState(false);

  const toast = useToast();

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
      toast.error('Failed to load organization schema: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setDeptLoading(true);
    try {
      await api.post('/organization/departments', deptForm);
      toast.success(`Department ${deptForm.name} created successfully.`);
      setShowDeptModal(false);
      setDeptForm({ code: '', name: '', description: '' });
      await loadData();
    } catch (err) {
      toast.error(`Department creation failed: ${err.message}`);
    } finally {
      setDeptLoading(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setRoleLoading(true);
    try {
      await api.post('/organization/roles', roleForm);
      toast.success(`Role ${roleForm.name} created successfully.`);
      setShowRoleModal(false);
      setRoleForm({ departmentCode: 'SALES', code: '', name: '', description: '', permissions: [] });
      await loadData();
    } catch (err) {
      toast.error(`Role creation failed: ${err.message}`);
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Configurable Organization & Capabilities"
        title="Departments, Roles & Permissions"
        description="Configure dynamic enterprise departments, operational roles, and granular security capability assignments."
        icon={ShieldCheck}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeptModal(true)}
              className="btn-secondary text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Department
            </button>
            <button
              onClick={() => setShowRoleModal(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Role
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Spinner className="w-8 h-8 text-brand-600" />
          <p className="text-xs text-slate-500">Loading role &amp; permission taxonomy...</p>
        </div>
      ) : (
        <>
          {/* Departments Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" /> Organization Departments ({departments.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((d) => (
                <div key={d.code} className="card p-4 space-y-1">
                  <div className="font-mono text-[10px] font-bold text-slate-400">{d.code}</div>
                  <div className="font-bold text-sm text-slate-900">{d.name}</div>
                  <p className="text-xs text-slate-500 line-clamp-2">{d.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Roles Section */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" /> Configured Roles &amp; Capabilities ({roles.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r) => (
                <div key={r.code} className="card p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                        {r.departmentCode}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{r.name}</h3>
                      <div className="text-[11px] text-slate-400 font-mono">{r.code}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{r.description}</p>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Granted Capabilities ({r.permissions?.includes('*') ? 'All / Wildcard' : r.permissions?.length})
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {r.permissions?.includes('*') ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-100 text-purple-800 font-bold">
                          * (Unrestricted Master Authority)
                        </span>
                      ) : (
                        r.permissions?.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
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
        </>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeptModal(false)}
          title="Create New Department"
          description="Register a top-level workspace unit."
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-dept-form"
                disabled={deptLoading}
                className="btn-primary text-xs"
              >
                {deptLoading ? 'Creating...' : 'Create Department'}
              </button>
            </>
          }
        >
          <form id="create-dept-form" onSubmit={handleCreateDept} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Code (UPPERCASE) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                placeholder="e.g. OPERATIONS"
                className="input text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                placeholder="e.g. Field Operations & Fleet"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                placeholder="Scope and purpose of this department..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Add Role Modal */}
      {showRoleModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowRoleModal(false)}
          title="Create New Role"
          description="Define a position and assign fine-grained capabilities."
          maxWidth="max-w-3xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-role-form"
                disabled={roleLoading}
                className="btn-primary text-xs"
              >
                {roleLoading ? 'Creating...' : 'Create Role'}
              </button>
            </>
          }
        >
          <form id="create-role-form" onSubmit={handleCreateRole} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={roleForm.departmentCode}
                  onChange={(e) => setRoleForm({ ...roleForm, departmentCode: e.target.value })}
                  className="input text-xs"
                >
                  {departments.map((d) => (
                    <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.code}
                  onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g. operations_lead"
                  className="input text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="e.g. Senior Operations Officer"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                placeholder="Responsibilities and access scope..."
                className="input resize-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Granular Permissions ({roleForm.permissions.length} selected)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {permissions.map((p) => {
                  const isChecked = roleForm.permissions.includes(p.code);
                  return (
                    <label key={p.code} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, p.code] });
                          } else {
                            setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter((x) => x !== p.code) });
                          }
                        }}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5"
                      />
                      <div>
                        <span className="font-mono text-[11px] font-semibold block">{p.code}</span>
                        <span className="text-[10px] text-slate-400">{p.description}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
