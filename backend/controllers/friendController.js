// backend/controllers/friendContoller.js

import db from '../config/db.js';

export const followUser = async (req, res) => {
    const followerId = req.user.id; // Extract userId from token
    const { followingId } = req.body;

    try {
        await db.query(
            `INSERT INTO Friends (user_id_1, user_id_2, status) VALUES (?, ?, 'Accepted')`,
            [followerId, followingId]
        );
        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
};

export const unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const { followingId } = req.body;

    try {
        await db.query(
            `DELETE FROM Friends WHERE user_id_1 = ? AND user_id_2 = ?`,
            [followerId, followingId]
        );
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
};