import { store } from '../../database/db.js';

export const notificationController = {
  async listNotifications(req, res) {
    try {
      const user = req.user;
      let notifications = store.get('notifications');

      // Filter by recipient employee ID or recipient department
      notifications = notifications.filter(n => {
        if (n.recipientId && n.recipientId === user.empId) return true;
        if (n.recipientDept && (user.departments.includes(n.recipientDept) || user.departments.includes('MASTER'))) return true;
        return false;
      });

      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const unreadCount = notifications.filter(n => !n.isRead).length;

      return res.json({ notifications, unreadCount });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notif = store.findById('notifications', id);
      if (notif) {
        store.updateById('notifications', notif.id, { isRead: true });
      }
      return res.json({ message: 'Marked as read.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const user = req.user;
      store.update('notifications', n => {
        if (n.recipientId === user.empId) return true;
        if (n.recipientDept && (user.departments.includes(n.recipientDept) || user.departments.includes('MASTER'))) return true;
        return false;
      }, { isRead: true });

      return res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
