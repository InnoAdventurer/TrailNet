// backend/routes/eventRoutes.js

import { Router } from 'express';
import db from '../config/db.js';
import { searchAddress } from '../controllers/mapController.js';

const router = Router();

// Create a new event
router.post('/create', async (req, res) => {
    const { event_name, description, event_date, start_time, end_time, location, latitude, longitude, privacy, trail_id } = req.body;

    const eventDateTime = new Date(`${event_date}T${start_time}`);
    const now = new Date();

    if (eventDateTime < now) {
        return res.status(400).json({ message: 'Event date and time must be in the future.' });
    }

    try {
        const query = `
            INSERT INTO Events (event_name, description, event_date, start_time, end_time, location, latitude, longitude, privacy, trail_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            event_name, description, event_date, start_time, end_time, location, latitude, longitude, privacy, trail_id
        ]);

        res.status(201).json({ message: 'Event created successfully', event_id: result.insertId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
});

router.get('/maps/search', searchAddress);

export default router;
