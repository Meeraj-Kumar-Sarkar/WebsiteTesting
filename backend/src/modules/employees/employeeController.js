import { store } from '../../database/db.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const employeeController = {
  // List all employees with department memberships and roles
  async listEmployees(req, res) {
    try {
      const users = store.get('users');
      const memberships = store.get('userDepartmentRoles');
      const roles = store.get('roles');

      const enriched = users.map(u => {
        const userMemberships = memberships.filter(m => m.userId === u.id);
        return {
          id: u.id,
          empId: u.empId,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          status: u.status,
          createdAt: u.createdAt,
          lastLoginAt: u.lastLoginAt,
          departments: [...new Set(userMemberships.map(m => m.departmentCode))],
          roles: userMemberships.map(m => {
            const roleObj = roles.find(r => r.code === m.roleCode);
            return {
              departmentCode: m.departmentCode,
              roleCode: m.roleCode,
              roleName: roleObj ? roleObj.name : m.roleCode
            };
          })
        };
      });

      return res.json(enriched);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get employee profile
  async getEmployee(req, res) {
    try {
      const { id } = req.params;
      const user = store.findById('users', id);
      if (!user) {
        return res.status(404).json({ error: 'Employee not found.' });
      }

      const memberships = store.find('userDepartmentRoles', m => m.userId === user.id);
      const auditLogs = store.find('auditLogs', a => a.entityId === user.empId || a.actorId === user.id);

      return res.json({
        user: {
          id: user.id,
          empId: user.empId,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        },
        memberships,
        activityHistory: auditLogs.slice(-20)
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Update Account Status (Activate, Freeze, Suspend, Block, Reactivate)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const allowed = ['ACTIVE', 'FROZEN', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED'];

      if (!allowed.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
      }

      const user = store.findById('users', id);
      if (!user) {
        return res.status(404).json({ error: 'Employee not found.' });
      }

      // Protection: Protect the last active Master account from demotion/blocking
      const memberships = store.find('userDepartmentRoles', m => m.userId === user.id);
      const isMaster = memberships.some(m => m.departmentCode === 'MASTER');

      if (isMaster && status !== 'ACTIVE') {
        const allMasters = store.find('userDepartmentRoles', m => m.departmentCode === 'MASTER');
        const activeMasters = store.find('users', u => u.status === 'ACTIVE' && allMasters.some(m => m.userId === u.id));
        if (activeMasters.length <= 1) {
          return res.status(400).json({
            error: 'Security constraint: Cannot deactivate or block the last active Master account.'
          });
        }
      }

      const oldStatus = user.status;
      store.updateById('users', user.id, { status, statusReason: reason || null });

      logAudit(req, `EMPLOYEE_STATUS_CHANGED`, 'EMPLOYEE', user.empId, {
        oldStatus,
        newStatus: status,
        reason
      });

      notify({
        recipientId: user.empId,
        title: `Account Status Changed: ${status}`,
        message: `Your account status was updated from ${oldStatus} to ${status}. Reason: ${reason || 'Administrative action'}`,
        category: 'SECURITY',
        linkedType: 'EMPLOYEE',
        linkedId: user.empId
      });

      return res.json({
        message: `Employee account status updated to ${status}.`,
        user: { ...user, status }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Assign department memberships and roles
  async assignRoles(req, res) {
    try {
      const { id } = req.params;
      const { memberships } = req.body; // Array of { departmentCode, roleCode }

      if (!Array.isArray(memberships) || memberships.length === 0) {
        return res.status(400).json({ error: 'At least one department role membership is required.' });
      }

      const user = store.findById('users', id);
      if (!user) {
        return res.status(404).json({ error: 'Employee not found.' });
      }

      // Remove existing memberships
      store.delete('userDepartmentRoles', m => m.userId === user.id);

      // Insert new memberships
      for (const m of memberships) {
        store.insert('userDepartmentRoles', {
          userId: user.id,
          departmentCode: m.departmentCode,
          roleCode: m.roleCode
        });
      }

      // If user was PENDING_MASTER_APPROVAL, automatically activate on assignment
      if (user.status === 'PENDING_MASTER_APPROVAL') {
        store.updateById('users', user.id, { status: 'ACTIVE' });
      }

      logAudit(req, 'EMPLOYEE_ROLES_ASSIGNED', 'EMPLOYEE', user.empId, { memberships });

      notify({
        recipientId: user.empId,
        title: 'Department & Role Assignment Updated',
        message: `Master has assigned you roles in: ${memberships.map(m => m.departmentCode).join(', ')}.`,
        category: 'EMPLOYEE_MANAGEMENT',
        linkedType: 'EMPLOYEE',
        linkedId: user.empId
      });

      return res.json({
        message: 'Departments and roles successfully updated.',
        memberships
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
