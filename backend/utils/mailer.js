// backend\utils\mailer.js

import nodemailer from 'nodemailer';
import { oAuth2Client } from './oauth2.js';
import dotenv from 'dotenv';

dotenv.config();

async function sendEmail(to, subject, text) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    console.log('Access Token:', accessToken.token);  // Log access token for debugging

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_ADDRESS,  // Ensure this is the correct email
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: to,
      subject: subject,
      text: text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);  // Log the result for debugging
    return result;
  } catch (error) {
    console.error('Error sending email:', error);  // Log detailed error
    throw error;
  }
}

export default sendEmail;