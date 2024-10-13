// backend\routes\mapRoutes.js

import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/friendController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Follow user
router.post('/follow', authMiddleware, followUser);

// Unfollow user
router.post('/unfollow', authMiddleware, unfollowUser);

export default router;