// backend/controllers/profileController.js

import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Update user's profile picture
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

// Update user's Full Name
export const updateFullName = async (req, res) => {
    const { full_name } = req.body;
    const userId = req.user.id; // Get userId from req.user (set by authMiddleware)

    try {
        await db.query('UPDATE Users SET username = ? WHERE user_id = ?', [full_name, userId]);
        res.status(200).json({ message: 'Full Name updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateEmail = async (req, res) => {
    const { email } = req.body;
    const userId = req.user.id; // Get userId from req.user (set by authMiddleware)

    try {
        await db.query('UPDATE Users SET email = ? WHERE user_id = ?', [email, userId]);
        res.status(200).json({ message: 'Email updated successfully' });
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
        const [userInfo] = await db.query('SELECT username, email, profile_picture FROM Users WHERE user_id = ?', [userId]);

        // If no user is found, return an error
        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the number of friends from the Friends table
        const [friendsCount] = await db.query('SELECT COUNT(*) as count FROM Friends WHERE user_id_2 = ?', [userId]);

        // Return the user's profile information
        res.status(200).json({
            username: userInfo[0].username,
            email: userInfo[0].email,
            profile_picture: userInfo[0].profile_picture,
            friendsCount: friendsCount[0].count
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update password
export const updatePassword = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        await db.query('UPDATE Users SET password_hash = ? WHERE user_id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password updated successfully' });
        console.log('Password updated successfully for user:', userId); // Log success
    } catch (error) {
        console.error('Error updating password:', error); // Log error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch followers
export const fetchFollowers = async (req, res) => {
    const userId = req.user.id;

    try {
        const [followers] = await db.query(`
            SELECT u.user_id, u.username FROM Friends f
            JOIN Users u ON f.user_id_1 = u.user_id
            WHERE f.user_id_2 = ? AND f.status = 'Accepted'
        `, [userId]);

        res.status(200).json(followers);
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch following
export const fetchFollowing = async (req, res) => {
    const userId = req.user.id;

    try {
        const [following] = await db.query(`
            SELECT u.user_id, u.username FROM Friends f
            JOIN Users u ON f.user_id_2 = u.user_id
            WHERE f.user_id_1 = ? AND f.status = 'Accepted'
        `, [userId]);

        res.status(200).json(following);
    } catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};