// backend\utils\resetToken.js

import crypto from 'crypto';
import { promisify } from 'util';
import db from '../config/db.js';

const randomBytes = promisify(crypto.randomBytes);

export const generateResetToken = async (email) => {
  const buffer = await randomBytes(32);
  const token = buffer.toString('hex');
  const expiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

  // Find the user by email
  const [user] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);

  if (!user.length) {
    throw new Error('User not found');
  }

  const userId = user[0].user_id;

  // Insert the token into the Password_Reset_Tokens table
  await db.query(
    'INSERT INTO Password_Reset_Tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiration]
  );

  // Return both the token and expiration time (in ms)
  return { token, expiration };
};

export const verifyResetToken = async (email, token) => {
  // Find the user by email
  const [user] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);

  if (!user.length) {
    return false; // User not found
  }

  const userId = user[0].user_id;

  // Check if the token exists and is still valid
  const [resetToken] = await db.query(
    'SELECT token, expires_at FROM Password_Reset_Tokens WHERE user_id = ? AND token = ?',
    [userId, token]
  );

  if (!resetToken.length) {
    return false; // Token not found or invalid
  }

  const tokenExpiry = new Date(resetToken[0].expires_at);
  if (Date.now() > tokenExpiry) {
    // Token has expired
    await db.query('DELETE FROM Password_Reset_Tokens WHERE user_id = ?', [userId]); // Clean up expired token
    return false;
  }

  return true;
};