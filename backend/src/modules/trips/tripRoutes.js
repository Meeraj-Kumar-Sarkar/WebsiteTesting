import { Router } from 'express';
import { tripController } from './tripController.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', tripController.listTrips);
router.get('/:id', tripController.getTrip);
router.post('/:id/suppliers', tripController.saveSupplier);
router.patch('/:id/status', tripController.updateTripStatus);
router.post('/:id/assign-media', tripController.assignMedia);

export default router;
