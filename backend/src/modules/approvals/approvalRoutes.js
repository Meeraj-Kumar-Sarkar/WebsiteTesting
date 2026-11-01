import { Router } from 'express';
import { approvalController } from './approvalController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('approvals.view'), approvalController.listPendingApprovals);
router.post('/:id/approve', requirePermission('approvals.approve'), approvalController.approveTripRequest);
router.post('/:id/reject', requirePermission('approvals.reject'), approvalController.rejectTripRequest);
router.post('/:id/request-changes', requirePermission('approvals.request_changes'), approvalController.requestChanges);
router.post('/:id/authorize-deposit', requirePermission('approvals.approve'), approvalController.authorizeDeposit);

export default router;
