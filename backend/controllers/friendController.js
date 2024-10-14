// backend/controllers/friendContoller.js

import db from '../config/db.js';
import { addNotification } from './notificationController.js';

// Follow a user and send a notification to the followed user
export const followUser = async (req, res) => {
    const followerId = req.user.id; // Extract user ID from token
    const { followingId } = req.body;

    if (!followingId) {
        return res.status(400).json({ error: 'Following ID is required' });
    }

    try {
        // Insert the follow relationship into the Friends table
        await db.query(
            `INSERT INTO Friends (user_id_1, user_id_2, status) VALUES (?, ?, 'Accepted')`,
            [followerId, followingId]
        );

        // Fetch the follower's name (to include in the notification)
        const [follower] = await db.query(
            `SELECT username FROM Users WHERE user_id = ?`,
            [followerId]
        );

        const followerName = follower[0]?.username || 'A user';

        // Use addNotification to send a notification to the followed user
        await addNotification(
            followingId,
            `${followerName} followed you.`,
            'Follow'
        );

        res.status(200).json({ message: 'Followed successfully and notification sent' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
};

export const unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const { followingId } = req.body;

    if (!followingId) {
        return res.status(400).json({ error: 'Following ID is required' });
    }

    try {
        await db.query(
            `DELETE FROM Friends WHERE user_id_1 = ? AND user_id_2 = ?`,
            [followerId, followingId]
        );
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
};