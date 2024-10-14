// controllers/emergencyController.js

import { sendGlobalNotification } from './notificationController.js';
import { fetchLocationName } from './mapController.js';
import db from '../config/db.js';

const getUserNameById = async (userId) => {
  const [rows] = await db.query('SELECT username FROM Users WHERE user_id = ?', [userId]);
  return rows.length > 0 ? rows[0].username : 'Unknown User';
};

export const handleAskForHelp = async (req, res) => {
  const { latitude, longitude } = req.body.location;
  const userId = req.user.id;

  try {
    const userName = await getUserNameById(userId);

    // Call the reusable function to get the location name
    const locationData = await fetchLocationName(latitude, longitude);
    const location = locationData.success ? locationData.location : 'Unknown Location';

    const message = `${userName} is requesting help at ${location}`;

    await sendGlobalNotification(message);

    res.status(200).json({ message: 'Help request sent to all users!' });
  } catch (error) {
    console.error('Error sending help request:', error);
    res.status(500).json({ message: 'Failed to send help request' });
  }
};