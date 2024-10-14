// backend\routes\profileRoutes.js

import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    updateProfilePicture,
    updateFullName,
    updateEmail,
    fetchUserInfo,
    updatePassword,
    fetchFollowers,
    fetchFollowing,
} from '../controllers/profileController.js';

const router = Router();

router.post('/update-picture', authMiddleware, updateProfilePicture);
router.post('/update-fullname', authMiddleware, updateFullName);
router.post('/update-email', authMiddleware, updateEmail);
router.post('/fetch', authMiddleware, fetchUserInfo);
router.post('/update-password', authMiddleware, updatePassword);
router.get('/followers', authMiddleware, fetchFollowers);
router.get('/following', authMiddleware, fetchFollowing);

export default router;