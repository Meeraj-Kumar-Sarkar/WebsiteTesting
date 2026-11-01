import { Router } from 'express';
import { packageController } from './packageController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

// Publicly readable packages endpoint
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, packageController.listPackages);

router.get('/:id', packageController.getPackage);

// Admin modification routes
router.use(authenticate);
router.post('/', requirePermission('packages.create'), packageController.createPackage);
router.patch('/:id', requirePermission('packages.update'), packageController.updatePackage);
router.patch('/:id/status', requirePermission('packages.disable'), packageController.toggleStatus);

export default router;
