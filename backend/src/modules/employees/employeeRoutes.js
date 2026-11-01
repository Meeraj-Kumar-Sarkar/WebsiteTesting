import { Router } from 'express';
import { employeeController } from './employeeController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('employees.view'), employeeController.listEmployees);
router.get('/:id', requirePermission('employees.view'), employeeController.getEmployee);
router.patch('/:id/status', requirePermission('employees.suspend'), employeeController.updateStatus);
router.post('/:id/assign-roles', requirePermission('employees.assign_roles'), employeeController.assignRoles);

export default router;
