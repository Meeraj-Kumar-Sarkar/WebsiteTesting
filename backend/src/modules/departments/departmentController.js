import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { logAudit } from '../../middleware/audit.js';

export const departmentController = {
  // Departments
  async listDepartments(req, res) {
    try {
      const departments = store.get('departments');
      return res.json(departments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async createDepartment(req, res) {
    try {
      const { code, name, description } = req.body;
      if (!code || !name) {
        return res.status(400).json({ error: 'Department code and name are required.' });
      }

      const existing = store.findOne('departments', d => d.code.toUpperCase() === code.toUpperCase());
      if (existing) {
        return res.status(409).json({ error: 'Department code already exists.' });
      }

      const newDept = {
        id: uuidv4(),
        code: code.toUpperCase().trim(),
        name: name.trim(),
        description: description || '',
        createdAt: new Date().toISOString()
      };

      store.insert('departments', newDept);
      logAudit(req, 'DEPARTMENT_CREATED', 'DEPARTMENT', newDept.code, newDept);

      return res.status(201).json(newDept);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Roles
  async listRoles(req, res) {
    try {
      const roles = store.get('roles');
      return res.json(roles);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async createRole(req, res) {
    try {
      const { departmentCode, code, name, description, permissions } = req.body;
      if (!departmentCode || !code || !name) {
        return res.status(400).json({ error: 'Department code, role code, and name are required.' });
      }

      const existing = store.findOne('roles', r => r.code.toUpperCase() === code.toUpperCase());
      if (existing) {
        return res.status(409).json({ error: 'Role code already exists.' });
      }

      const newRole = {
        id: uuidv4(),
        departmentCode: departmentCode.toUpperCase().trim(),
        code: code.toUpperCase().trim(),
        name: name.trim(),
        description: description || '',
        permissions: permissions || [],
        createdAt: new Date().toISOString()
      };

      store.insert('roles', newRole);
      logAudit(req, 'ROLE_CREATED', 'ROLE', newRole.code, newRole);

      return res.status(201).json(newRole);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async updateRolePermissions(req, res) {
    try {
      const { id } = req.params;
      const { permissions } = req.body;

      if (!Array.isArray(permissions)) {
        return res.status(400).json({ error: 'Permissions must be an array of permission codes.' });
      }

      const role = store.findById('roles', id);
      if (!role) {
        return res.status(404).json({ error: 'Role not found.' });
      }

      store.updateById('roles', role.id, { permissions });
      logAudit(req, 'ROLE_PERMISSIONS_UPDATED', 'ROLE', role.code, { permissions });

      return res.json({ message: 'Role permissions updated successfully.', role: { ...role, permissions } });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Permissions Catalogue
  async listPermissions(req, res) {
    try {
      const permissions = store.get('permissions');
      return res.json(permissions);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
