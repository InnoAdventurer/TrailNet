import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Adjust this to your frontend's address
    optionsSuccessStatus: 200
};

// Enable CORS for all routes
app.use(cors(corsOptions)); // Enable CORS

app.use(json()); // Middleware to parse JSON requests

app.use('/api/auth', authRoutes); // Use the auth routes

export default app;
