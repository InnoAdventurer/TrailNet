// backend/routes/emergencyRoutes.js

import express from 'express';
import { handleAskForHelp } from '../controllers/emergencyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/help', authMiddleware, handleAskForHelp);

export default router;