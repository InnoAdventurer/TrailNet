// backend\routes\mapRoutes.js

import { Router } from 'express';
import { searchAddress } from '../controllers/mapController.js';
const router = Router();

router.get('/search', searchAddress);

export default router;
