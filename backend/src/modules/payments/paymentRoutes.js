import { Router } from 'express';
import { paymentController } from './paymentController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

// Allow submitting payment reference (Sales or customer)
router.post('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, paymentController.submitPayment);

router.use(authenticate);
router.get('/', requirePermission('finance.view'), paymentController.listPayments);
router.post('/:id/verify', requirePermission('payments.verify'), paymentController.verifyPayment);
router.post('/:id/reject', requirePermission('payments.verify'), paymentController.rejectPayment);

export default router;
