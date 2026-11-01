import { store } from '../../database/db.js';
import { logAudit } from '../../middleware/audit.js';

export const reportController = {
  // 1. Audit Logs list with advanced filtering
  async listAuditLogs(req, res) {
    try {
      const { department, action, entityType, actorEmpId, startDate, endDate, search } = req.query;
      let logs = store.get('auditLogs');

      if (department && department !== 'ALL') {
        logs = logs.filter(l => l.department === department);
      }

      if (action && action !== 'ALL') {
        logs = logs.filter(l => l.action === action);
      }

      if (entityType && entityType !== 'ALL') {
        logs = logs.filter(l => l.entityType === entityType);
      }

      if (actorEmpId) {
        logs = logs.filter(l => l.empId === actorEmpId);
      }

      if (startDate) {
        logs = logs.filter(l => l.createdAt >= startDate);
      }

      if (endDate) {
        logs = logs.filter(l => l.createdAt <= endDate);
      }

      if (search) {
        const q = search.toLowerCase();
        logs = logs.filter(l =>
          l.action?.toLowerCase().includes(q) ||
          l.actorName?.toLowerCase().includes(q) ||
          l.entityId?.toLowerCase().includes(q)
        );
      }

      logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Export Audit Logs as CSV
  async exportAuditLogsCsv(req, res) {
    try {
      const logs = store.get('auditLogs');
      logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const header = 'Timestamp,Employee ID,Actor Name,Department,Action,Entity Type,Entity ID,Details\n';
      const rows = logs.map(l => {
        const detailsStr = l.details ? JSON.stringify(l.details).replace(/"/g, '""') : '';
        return `"${l.createdAt}","${l.empId || ''}","${l.actorName || ''}","${l.department || ''}","${l.action}","${l.entityType}","${l.entityId || ''}","${detailsStr}"`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="mountain-memories-audit-log.csv"');
      return res.send(header + rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Export Finance Summary as CSV
  async exportFinanceSummaryCsv(req, res) {
    try {
      const invoices = store.get('invoices');
      const header = 'Invoice ID,Trip Request ID,Customer Name,Phone,Total Amount (INR),Amount Received,Balance Due,Due Date,Status,Created At\n';
      const rows = invoices.map(i => {
        return `"${i.invoiceId}","${i.tripRequestId}","${i.customerName}","${i.customerPhone || ''}",${i.totalAmount},${i.amountReceived},${i.balanceDue},"${i.dueDate || ''}","${i.status}","${i.createdAt}"`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="mountain-memories-finance-report.csv"');
      return res.send(header + rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. System Settings (Master)
  async getSystemSettings(req, res) {
    try {
      const settings = store.data.systemSettings;
      return res.json(settings);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async updateSystemSettings(req, res) {
    try {
      const updates = req.body;
      store.data.systemSettings = { ...store.data.systemSettings, ...updates };
      store.save();

      logAudit(req, 'SYSTEM_SETTINGS_UPDATED', 'SYSTEM', 'CONFIG', updates);

      return res.json({ message: 'System settings updated successfully.', settings: store.data.systemSettings });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
