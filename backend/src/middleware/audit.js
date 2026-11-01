import { v4 as uuidv4 } from 'uuid';
import { store } from '../database/db.js';

export function logAudit(req, action, entityType, entityId, details = {}) {
  const actor = req?.user || {
    id: 'SYSTEM',
    empId: 'SYS',
    fullName: 'System Automation',
    departments: ['SYSTEM']
  };

  const auditEntry = {
    id: uuidv4(),
    actorId: actor.id,
    empId: actor.empId,
    actorName: actor.fullName,
    department: actor.activeDepartment || actor.departments?.[0] || 'GENERAL',
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date().toISOString()
  };

  store.insert('auditLogs', auditEntry);
  return auditEntry;
}

export function notify({ recipientDept = null, recipientId = null, title, message, category = 'SYSTEM', linkedType = null, linkedId = null }) {
  const notification = {
    id: uuidv4(),
    recipientDept,
    recipientId,
    title,
    message,
    category,
    linkedRecordType: linkedType,
    linkedRecordId: linkedId,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  store.insert('notifications', notification);
  return notification;
}
