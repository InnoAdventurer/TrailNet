// backend\routes\authRoutes.js

import { Router } from 'express';
import { register, login, sendPasswordResetEmail } from '../controllers/authController.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendPasswordResetEmail);

export default router;
