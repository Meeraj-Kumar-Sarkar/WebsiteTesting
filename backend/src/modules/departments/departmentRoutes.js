import { Router } from 'express';
import { departmentController } from './departmentController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

// Departments
router.get('/departments', departmentController.listDepartments);
router.post('/departments', requirePermission('departments.manage'), departmentController.createDepartment);

// Roles
router.get('/roles', departmentController.listRoles);
router.post('/roles', requirePermission('roles.manage'), departmentController.createRole);
router.patch('/roles/:id/permissions', requirePermission('permissions.assign'), departmentController.updateRolePermissions);

// Permissions
router.get('/permissions', departmentController.listPermissions);

export default router;
