// backend/routes/notificationRoutes.js

import express from 'express';
import { getNotifications, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/getByUser', authMiddleware, getNotifications);
router.patch('/markAllAsRead', authMiddleware, markAllAsRead);
router.delete('/delete/:notification_id', authMiddleware, deleteNotification);

export default router;