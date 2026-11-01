import { Router } from 'express';
import { tripRequestController } from './tripRequestController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('trip_requests.view'), tripRequestController.listTripRequests);
router.post('/', requirePermission('trip_requests.create'), tripRequestController.createTripRequest);
router.get('/:id', requirePermission('trip_requests.view'), tripRequestController.getTripRequest);
router.post('/:id/travellers', requirePermission('travellers.manage'), tripRequestController.saveTravellers);
router.post('/:id/submit', requirePermission('trip_requests.submit'), tripRequestController.submitTripRequest);
router.post('/:id/deposit-exception', requirePermission('trip_requests.create'), tripRequestController.requestDepositException);

export default router;
