// backend/routes/osmStaticRoutes.js

import { Router } from 'express';
import { generateStaticMap } from '../controllers/osmStaticController.js';

const router = Router();

// Route to generate static map images with coordinates
router.get('/pic', generateStaticMap);

export default router;