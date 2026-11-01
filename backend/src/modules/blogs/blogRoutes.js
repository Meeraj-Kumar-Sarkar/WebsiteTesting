import { Router } from 'express';
import { blogController } from './blogController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

// Public blog listings
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, blogController.listBlogs);

router.get('/:identifier', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, blogController.getBlog);

// Protected Blog routes
router.use(authenticate);
router.post('/', requirePermission('blogs.create'), blogController.createBlog);
router.patch('/:id', requirePermission('blogs.update_own'), blogController.updateBlog);
router.post('/:id/hide', requirePermission('blogs.hide'), blogController.hideBlog);
router.post('/:id/publish', requirePermission('blogs.publish'), blogController.publishBlog);

export default router;
