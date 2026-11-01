import { Router } from 'express';
import { enquiryController } from './enquiryController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

// Public / Website Ingestion route (supports optional auth if sent by Sales)
router.post('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, enquiryController.createEnquiry);

// Protected Admin Routes
router.use(authenticate);
router.get('/', requirePermission('enquiries.view'), enquiryController.listEnquiries);
router.get('/:id', requirePermission('enquiries.view'), enquiryController.getEnquiry);
router.patch('/:id/status', requirePermission('enquiries.update'), enquiryController.updateStatus);
router.post('/:id/notes', requirePermission('enquiries.update'), enquiryController.addNote);
router.post('/:id/merge', requirePermission('enquiries.merge'), enquiryController.mergeEnquiry);
router.post('/:id/archive', requirePermission('enquiries.archive'), enquiryController.archiveEnquiry);

export default router;
