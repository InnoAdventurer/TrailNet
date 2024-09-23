// backend\routes\mapRoutes.js

import { Router } from 'express';
import { searchAddress, getCoordinatesForLocation, getLocationForCoordinates } from '../controllers/mapController.js';
const router = Router();

router.get('/search', searchAddress);

// Get GPS coordinates for a location
router.post('/get-coordinates', getCoordinatesForLocation);

// Get location for GPS coordinates (reverse geocoding)
router.post('/reverse-geocode', getLocationForCoordinates);

export default router;
