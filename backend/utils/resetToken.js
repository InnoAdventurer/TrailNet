// backend\utils\resetToken.js

import crypto from 'crypto';
import { promisify } from 'util';
import db from '../config/db.js';

const randomBytes = promisify(crypto.randomBytes);

export const generateResetToken = async (email) => {
  const buffer = await randomBytes(32);
  const token = buffer.toString('hex');
  const expiration = Date.now() + 3600000; // Token valid for 1 hour

  // Store the token in the database with the email
  await db.query(
    'UPDATE Users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
    [token, expiration, email]
  );

  return token;
};
