// backend/routes/notificationRoutes.js

import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/getByUser', authMiddleware, getNotifications);
router.patch('/markAsRead', authMiddleware, markAsRead);
router.delete('/delete/:notification_id', authMiddleware, deleteNotification);

export default router;