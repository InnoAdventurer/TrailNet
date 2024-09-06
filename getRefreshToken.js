import { google } from 'googleapis';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; 

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const getAccessToken = () => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    rl.question('Enter the code from that page here: ', (code) => {
        oAuth2Client.getToken(code).then(({ tokens }) => {
            oAuth2Client.setCredentials(tokens);
            console.log('Your access token is:', tokens.access_token);
            console.log('Your refresh token is:', tokens.refresh_token);
            rl.close();
        }).catch((error) => {
            console.error('Error retrieving access token', error);
        });
    });
};

getAccessToken();