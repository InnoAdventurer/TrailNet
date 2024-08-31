import express, { json } from 'express';
import authRoutes from './routes/authRoutes.js';
const app = express();

app.use(json()); // Middleware to parse JSON requests

app.use('/api/auth', authRoutes); // Use the auth routes

export default app;
