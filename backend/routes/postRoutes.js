// backend/routes/postRoutes.js

import { Router } from 'express';
import { 
    createPostWithCompressedImage, 
    fetchProfilePosts, 
    fetchHomePagePosts, 
    likePost, 
    unlikePost, 
    getLikesForPost 
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Import the auth middleware to ensure protected routes

const router = Router();

// Route to create a new post with image upload (protected by auth middleware)
router.post('/create', authMiddleware, createPostWithCompressedImage);

// Fetch posts for the authenticated user's profile page
router.get('/user-posts', authMiddleware, fetchProfilePosts);

// Fetch posts for the authenticated user's home page
router.get('/home-posts', authMiddleware, fetchHomePagePosts);

// Like related routes
router.post('/like', authMiddleware, likePost);
router.post('/unlike', authMiddleware, unlikePost);
router.get('/:post_id/likes', authMiddleware, getLikesForPost);

export default router;