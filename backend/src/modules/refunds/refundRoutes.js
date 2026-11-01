import { Router } from 'express';
import { refundController } from './refundController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('finance.view'), refundController.listRefunds);
router.post('/request', requirePermission('trip_requests.create'), refundController.requestCancellation);
router.post('/:id/approve', requirePermission('approvals.approve'), refundController.approveCancellation);
router.post('/:id/calculate', requirePermission('refunds.calculate'), refundController.calculateRefund);
router.post('/:id/execute', requirePermission('refunds.execute'), refundController.executeRefund);

export default router;
