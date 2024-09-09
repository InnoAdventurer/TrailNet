// backend\app.js

import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { handleOAuth2Callback } from './utils/oauth2.js';
import sendEmail from './utils/mailer.js';
import weatherRoutes from './routes/weatherRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import timeRoutes from './routes/timeRoutes.js';

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Adjust this to your frontend's address
    optionsSuccessStatus: 200
};

// Enable CORS for all routes
app.use(cors(corsOptions));
app.use(json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Weather-related routes
app.use('/api/weather', weatherRoutes);

// Event-related routes
app.use('/api/events', eventRoutes);

// Time-related routes (e.g., for current time)
app.use('/api/time', timeRoutes);

// Route to handle OAuth2 callback
app.get('/oauth2callback', handleOAuth2Callback);

// Test email route
app.get('/test-email', async (req, res) => {
    try {
        const result = await sendEmail(
            'waichun_2009@hotmail.com', // Replace with the recipient's email
            'Test Email',
            'This is a test email to verify the email functionality.'
        );
        res.send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).send('Failed to send email.');
    }
});

export default app;