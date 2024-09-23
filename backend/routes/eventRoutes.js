// backend/routes/eventRoutes.js

import { Router } from 'express';
import { createEvent, getUpcomingEvents, getMoreEvents, getEventById } from '../controllers/eventController.js';
import { searchAddress } from '../controllers/mapController.js';

const router = Router();

// Route for event creation
router.post('/create', createEvent);

// Get upcoming events
router.post('/upcoming', getUpcomingEvents);

// Get more events (e.g., "More Events" page)
router.post('/more', getMoreEvents);

// Get a single event by its ID
router.get('/:id', getEventById);

export default router;