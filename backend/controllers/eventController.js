// backend/controllers/eventController.js

import db from '../config/db.js';

export const createEvent = async (req, res) => {
    const { event_name, description, event_date, start_time, end_time, location, latitude, longitude, privacy, trail_id, activity_type } = req.body;

    const eventDateTime = new Date(`${event_date}T${start_time}`);
    const now = new Date();

    if (eventDateTime < now) {
        return res.status(400).json({ message: 'Event date and time must be in the future.' });
    }

    try {
        const query = `
            INSERT INTO Events (event_name, description, event_date, start_time, end_time, location, latitude, longitude, privacy, trail_id, activity_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            event_name, description, event_date, start_time, end_time, location, latitude, longitude, privacy, trail_id, activity_type
        ]);

        res.status(201).json({ message: 'Event created successfully', event_id: result.insertId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
};

// Fetch upcoming 10 events events (main page)
export const getUpcoming10Events = async (req, res) => {
    try {
        // Query to fetch the 10 upcoming events
        let query = 'SELECT * FROM Events WHERE event_date >= CURDATE() ORDER BY event_date ASC LIMIT 10';

        // Execute the query without additional filters
        const [events] = await db.query(query);

        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Fetch a single event by ID
export const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const [event] = await db.query('SELECT * FROM Events WHERE event_id = ?', [id]);

        if (!event.length) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, event: event[0] });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get filtered events
export const getFilteredEvents = async (req, res) => {
    const { latitude, longitude, activityType, dateRange } = req.body;

    try {
        let query = 'SELECT * FROM Events WHERE event_date >= CURDATE()';
        const queryParams = [];

        // Filter by GPS coordinates if provided and valid
        if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude)) {
            const distanceLimit = 0.01; // Adjust the distance limit as needed
            query += ' AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?';
            queryParams.push(latitude - distanceLimit, latitude + distanceLimit, longitude - distanceLimit, longitude + distanceLimit);
        }

        // Filter by activity type if provided
        if (activityType !== null && activityType !== undefined) {
            query += ' AND activity_type = ?';
            queryParams.push(activityType);
        }

        // Filter by date range if provided
        switch (dateRange) {
            case 'Today':
                query += ' AND event_date = CURDATE()';
                break;
            case 'Next7days':
                query += ' AND event_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)';
                break;
            case 'Over7days':
                query += ' AND event_date > DATE_ADD(CURDATE(), INTERVAL 7 DAY)';
                break;
            default:
                break; // No date range filtering if no valid range is provided
        }

        // Limit to only 50 events and sort by event_date
        query += ' ORDER BY event_date ASC LIMIT 50';

        const [events] = await db.query(query, queryParams);
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};  