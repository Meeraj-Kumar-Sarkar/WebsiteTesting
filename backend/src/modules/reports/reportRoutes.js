import { Router } from 'express';
import { reportController } from './reportController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/audit-logs', requirePermission('reports.view'), reportController.listAuditLogs);
router.get('/audit-logs/export', requirePermission('reports.export'), reportController.exportAuditLogsCsv);
router.get('/finance/export', requirePermission('reports.export'), reportController.exportFinanceSummaryCsv);

router.get('/system-settings', reportController.getSystemSettings);
router.patch('/system-settings', requirePermission('system.settings.manage'), reportController.updateSystemSettings);

export default router;
