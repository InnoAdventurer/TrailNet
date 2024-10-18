// backend\routes\mapRoutes.js

import { Router } from 'express';
import { searchAddress, getCoordinatesForLocation, getLocationForCoordinates, calculateRouteAndDistance } from '../controllers/mapController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/search', searchAddress);

// Get GPS coordinates for a location
router.post('/get-coordinates', getCoordinatesForLocation);

// Get location for GPS coordinates (reverse geocoding)
router.post('/reverse-geocode', getLocationForCoordinates);

// Get foot walking distance between 2 GPS coordinates
router.post('/calculate-distance', calculateRouteAndDistance)

export default router;
