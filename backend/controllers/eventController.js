// backend/controllers/eventController.js

import db from '../config/db.js';

export const createEvent = async (req, res) => {
    const {
        event_name, description, event_date, start_time, end_time,
        location, latitude, longitude, privacy, trail_id, activity_type
    } = req.body;

    const user_id = req.user.id; // Get user_id from the token
    const eventDateTime = new Date(`${event_date}T${start_time}`);
    const now = new Date();

    if (eventDateTime < now) {
        return res.status(400).json({ message: 'Event date and time must be in the future.' });
    }

    try {
        const query = `
            INSERT INTO Events (user_id, event_name, description, event_date, start_time, 
                                end_time, location, latitude, longitude, privacy, trail_id, activity_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            user_id, event_name, description, event_date, start_time, end_time, 
            location, latitude, longitude, privacy, trail_id, activity_type
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

        // Process each event to extract the location before the first comma
        const processedEvents = events.map(event => ({
            ...event,
            location: event.location.split(',')[0] // Extract location before the first comma
        }));

        res.status(200).json({ success: true, events: processedEvents });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Join or update user participation in an event
export const toggleEventParticipation = async (req, res) => {
    const { event_id, status } = req.body;
    const user_id = req.user.id;

    try {
        // Check if the user already has a record for this event
        const [existing] = await db.query(
            'SELECT * FROM User_Events WHERE user_id = ? AND event_id = ?',
            [user_id, event_id]
        );

        if (existing.length > 0) {
            // Update the status if the record exists
            await db.query(
                'UPDATE User_Events SET status = ? WHERE user_event_id = ?',
                [status, existing[0].user_event_id]
            );
        } else {
            // Create a new entry if not existing
            await db.query(
                'INSERT INTO User_Events (user_id, event_id, status) VALUES (?, ?, ?)',
                [user_id, event_id, status]
            );
        }

        res.status(200).json({ message: 'Participation status updated successfully' });
    } catch (error) {
        console.error('Error toggling participation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch event details including participants
export const fetchEventWithParticipants = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const [event] = await db.query(
            `SELECT e.*, u.username AS creator 
            FROM Events e 
            JOIN Users u ON e.user_id = u.user_id 
            WHERE e.event_id = ?`,
            [id]
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        const [participants] = await db.query(
            `SELECT u.user_id, u.username 
            FROM User_Events ue 
            JOIN Users u ON ue.user_id = u.user_id 
            WHERE ue.event_id = ? AND ue.status = 'Going'`,
            [id]
        );

        const [userParticipation] = await db.query(
            `SELECT status FROM User_Events 
            WHERE user_id = ? AND event_id = ?`,
            [userId, id]
        );

        res.status(200).json({
            event,
            participants,
            userParticipation: userParticipation[0] || { status: 'Not Going' }
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
