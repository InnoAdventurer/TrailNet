// backend\utils\oauth2.js

import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Set the credentials, including the refresh token
oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
});

// Function to handle OAuth2 callback
const handleOAuth2Callback = async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Store the tokens securely (e.g., in your database)
        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);

        if (!tokens.refresh_token) {
            console.error('No refresh token returned. Ensure that you requested offline access and that the refresh token was not already issued and revoked.');
        }

        res.send('Authentication successful! You can close this tab.');
    } catch (error) {
        console.error('Error retrieving access token:', error);
        res.status(500).send('Authentication failed. Please try again.');
    }
};

export { oAuth2Client, handleOAuth2Callback };