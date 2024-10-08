// backend/controllers/profileController.js

import db from '../config/db.js';

export const updateProfilePicture = async (req, res) => {
    const { profile_picture } = req.body;
    const userId = req.user.id; // Get userId from req.user (set by authMiddleware)

    try {
        await db.query('UPDATE Users SET profile_picture = ? WHERE user_id = ?', [profile_picture, userId]);
        res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch the user's information
export const fetchUserInfo = async (req, res) => {
    const userId = req.user.id; // Get userId from req.user (set by authMiddleware)

    try {
        // Fetch user info from the Users table
        const [userInfo] = await db.query('SELECT username, profile_picture FROM Users WHERE user_id = ?', [userId]);

        // If no user is found, return an error
        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the number of friends from the Friends table (assuming you have a Friends table)
        const [friendsCount] = await db.query('SELECT COUNT(*) as count FROM Friends WHERE user_id_1 = ?', [userId]);

        // Return the user's profile information
        res.status(200).json({
            username: userInfo[0].username,
            profile_picture: userInfo[0].profile_picture,
            friendsCount: friendsCount[0].count
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};