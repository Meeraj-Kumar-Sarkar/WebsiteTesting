export function requirePermission(permissionCode) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Master has wildcard access
    if (req.user.permissions.includes('*') || req.user.departments.includes('MASTER')) {
      return next();
    }

    if (req.user.permissions.includes(permissionCode)) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Requires '${permissionCode}' permission.`,
      requiredPermission: permissionCode
    });
  };
}

export function requireDepartment(...allowedDepartments) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.user.departments.includes('MASTER')) {
      return next();
    }

    const hasDept = allowedDepartments.some(dept => req.user.departments.includes(dept));
    if (hasDept) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Requires membership in: ${allowedDepartments.join(', ')}`,
      allowedDepartments
    });
  };
}
