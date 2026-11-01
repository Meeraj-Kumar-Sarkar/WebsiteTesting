import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { store } from '../database/db.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = store.findOne('users', u => u.id === decoded.id || u.empId === decoded.empId);

    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      const statusMessages = {
        PENDING_VERIFICATION: 'Your email is not verified yet. Please verify with OTP.',
        PENDING_MASTER_APPROVAL: 'Your registration is pending Master approval and role assignment.',
        FROZEN: 'Your account has been temporarily frozen. Please contact Management.',
        SUSPENDED: 'Your account is suspended pending review.',
        BLOCKED: 'Your account has been administratively blocked.',
        DEACTIVATED: 'Your account has been deactivated.'
      };
      return res.status(403).json({
        error: statusMessages[user.status] || 'Account is not active.',
        accountStatus: user.status
      });
    }

    // Load user's department roles and permissions
    const memberships = store.find('userDepartmentRoles', udr => udr.userId === user.id);
    const roles = store.get('roles');
    const rolePermissions = store.get('rolePermissions') || [];

    const userDepartments = [...new Set(memberships.map(m => m.departmentCode))];
    const userRoleCodes = [...new Set(memberships.map(m => m.roleCode))];

    // Gather permissions
    const permissions = new Set();
    // Master department automatically has all system permissions
    if (userDepartments.includes('MASTER')) {
      permissions.add('*');
    }

    for (const membership of memberships) {
      const role = roles.find(r => r.code === membership.roleCode);
      if (role) {
        const assigned = role.permissions || [];
        assigned.forEach(p => permissions.add(p));
      }
    }

    req.user = {
      id: user.id,
      empId: user.empId,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      departments: userDepartments,
      roles: userRoleCodes,
      memberships,
      permissions: Array.from(permissions),
      activeDepartment: req.headers['x-active-department'] || userDepartments[0] || 'SALES'
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}
