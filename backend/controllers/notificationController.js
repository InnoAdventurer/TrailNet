// backend/controllers/notificationController.js

import db from '../config/db.js';

// Fetch notifications for the authenticated user
export const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const [notifications] = await db.query(
      `SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    res.json(notifications); // Just send the raw notifications with UTC timestamps
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new notification
export const addNotification = async (user_id, message, notification_type) => {
    try {
        const query = `
        INSERT INTO Notifications (user_id, message, notification_type, is_read)
        VALUES (?, ?, ?, false);
        `;
        await db.query(query, [user_id, message, notification_type]);
    } catch (error) {
        console.error('Error adding notification:', error);
        throw new Error('Failed to add notification');
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  const { notification_id } = req.body;
  try {
    await db.query('UPDATE Notifications SET is_read = TRUE WHERE notification_id = ?', [notification_id]);
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  const { notification_id } = req.params;
  try {
    await db.query('DELETE FROM Notifications WHERE notification_id = ?', [notification_id]);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

export const sendGlobalNotification = async (message) => {
  try {
    await db.query(
      `INSERT INTO Notifications (user_id, notification_type, message, is_read)
       SELECT user_id, 'Help Seeking', ?, FALSE FROM Users`,
      [message]
    );
    console.log('Global notification sent successfully.');
  } catch (error) {
    console.error('Error sending global notification:', error);
  }
};

