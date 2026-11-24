import { Router } from 'express';
import { publicController } from './publicController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

// Public Endpoints
router.get('/settings', publicController.getPublicSettings);
router.get('/destinations', publicController.listDestinations);
router.get('/destinations/:slug', publicController.getDestination);
router.get('/stays', publicController.listStays);

// Protected Management Endpoints
router.post('/destinations', authenticate, requirePermission('packages.create'), publicController.createDestination);
router.delete('/destinations/:id', authenticate, requirePermission('packages.disable'), publicController.deleteDestination);
router.post('/stays', authenticate, requirePermission('packages.create'), publicController.createStay);
router.delete('/stays/:id', authenticate, requirePermission('packages.disable'), publicController.deleteStay);

export default router;
