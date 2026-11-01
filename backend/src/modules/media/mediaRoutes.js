import { Router } from 'express';
import { mediaController } from './mediaController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

// Public Gallery
router.get('/public-gallery', mediaController.getPublicGallery);

// Protected Media routes
router.use(authenticate);
router.get('/trips/:tripId', requirePermission('media.upload'), mediaController.getTripMedia);
router.post('/upload', requirePermission('media.upload'), mediaController.uploadMedia);
router.patch('/:id/visibility', requirePermission('media.mark_public'), mediaController.updateVisibility);
router.post('/trips/:tripId/share-archive', requirePermission('media.share_customer'), mediaController.shareCustomerArchive);

export default router;
