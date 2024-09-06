// backend\controllers\authController.js

import bcrypt from 'bcryptjs';  // Import the entire bcryptjs module
import jwt from 'jsonwebtoken';  // Import the entire jsonwebtoken module
import db from '../config/db.js';
import sendEmail from '../utils/mailer.js';
import { generateResetToken } from '../utils/resetToken.js';

// Destructure the methods you need from bcrypt
const { hash, compare } = bcrypt;

export const register = async (req, res) => {
    const { username, email, password, profile_picture, bio } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with that email or username already exists' });
        }

        const hashedPassword = await hash(password, 10);
        await db.query(
            'INSERT INTO Users (username, email, password_hash, profile_picture, bio) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, profile_picture || null, bio || null]
        );

        console.log('User registered successfully:', username, email); // Log the successful registration
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error); // Log the error to the console
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt:', email);  // Log login attempt

        const [user] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            console.log('Invalid credentials: User not found');
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await compare(password, user[0].password_hash);
        if (!isMatch) {
            console.log('Invalid credentials: Password mismatch');
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Login successful:', email);  // Log successful login

        res.status(200).json({
            success: true,
            message: 'Login successful',  // Clear success message
            token,
            user: {
                id: user[0].user_id,
                username: user[0].username,
                email: user[0].email,
                profile_picture: user[0].profile_picture,
                bio: user[0].bio,
            },
        });
    } catch (error) {
        console.error('Error during login:', error); // Log the error to the console
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (user.length > 0) {
        const token = await generateResetToken(email);

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;
        const message = `Please use the following link to reset your password: ${resetUrl}`;

        await sendEmail(email, 'Password Reset', message);
        }

        // Always respond with a generic message
        res.status(200).json({ message: 'If the email is found in our records, a password reset email will be sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};