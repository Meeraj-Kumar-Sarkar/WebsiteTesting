import { Router } from 'express';
import { financeController } from './financeController.js';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermission } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', requirePermission('finance.view'), financeController.getDashboardMetrics);
router.post('/cost-report', requirePermission('finance.report.create'), financeController.saveFinancialReport);
router.get('/invoices', requirePermission('finance.view'), financeController.listInvoices);
router.post('/invoices', requirePermission('invoices.create'), financeController.createInvoice);
router.get('/invoices/:id', requirePermission('finance.view'), financeController.getInvoice);

export default router;
