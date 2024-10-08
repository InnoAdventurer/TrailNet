// backend\routes\profileRoutes.js

import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { updateProfilePicture, fetchUserInfo } from '../controllers/profileController.js';

const router = Router();

router.post('/update-picture', authMiddleware, updateProfilePicture);
router.post('/fetch', authMiddleware, fetchUserInfo);

export default router;