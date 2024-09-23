// backend/routes/eventRoutes.js

import { Router } from 'express';
import { createEvent, getUpcoming10Events, getFilteredEvents, getEventById } from '../controllers/eventController.js';

const router = Router();

// Route for event creation
router.post('/create', createEvent);

// Get upcoming 10 events events
router.post('/10events', getUpcoming10Events);

// Get more events (e.g., "More Events" page)
router.post('/more', getFilteredEvents);

// Get a single event by its ID
router.get('/:id', getEventById);

export default router;