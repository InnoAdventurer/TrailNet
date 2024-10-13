// backend/routes/eventRoutes.js

import { Router } from 'express';
import { createEvent, getUpcoming10Events, getFilteredEvents, toggleEventParticipation, fetchEventWithParticipants } from '../controllers/eventController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Apply authMiddleware to routes that require authentication
// Route for event creation
router.post('/create', authMiddleware, createEvent);

// Get upcoming 10 events events
router.post('/10events', authMiddleware, getUpcoming10Events);

// Get more events (e.g., "More Events" page)
router.post('/more', authMiddleware, getFilteredEvents);

// Fetch event with participants
router.get('/:id', authMiddleware, fetchEventWithParticipants);

// Toggle participation
router.post('/toggle-participation', authMiddleware, toggleEventParticipation);  


export default router;