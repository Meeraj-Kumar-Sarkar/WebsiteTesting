import { Router } from 'express';
import { mediaController } from './mediaController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';
import { uploadMiddleware } from '../../services/storageService.js';

const router = Router();

// Public Gallery & Shared Customer Archives
router.get('/public-gallery', mediaController.getPublicGallery);
router.get('/archive/:shareToken', mediaController.getSharedArchive);

// Protected Media routes
router.use(authenticate);
router.get('/', mediaController.listAllMedia);
router.get('/trips/:tripId', requirePermission('media.upload'), mediaController.getTripMedia);
router.post('/upload-file', uploadMiddleware.single('file'), mediaController.uploadFileOnly);
router.post('/upload', requirePermission('media.upload'), uploadMiddleware.single('file'), mediaController.uploadMedia);
router.post('/trips/:tripId/upload', requirePermission('media.upload'), uploadMiddleware.single('file'), mediaController.uploadMedia);
router.patch('/:id/visibility', requirePermission('media.mark_public'), mediaController.updateVisibility);
router.delete('/:id', requirePermission('media.upload'), mediaController.deleteMedia);
router.post('/trips/:tripId/share-archive', requirePermission('media.share_customer'), mediaController.shareCustomerArchive);

export default router;
