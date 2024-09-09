// backend\controllers\mapController.js

import axios from 'axios';

export async function searchAddress(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5,
        countrycodes: 'AU', // Restrict results to Australia
        addressdetails: 1, // Include address details in the response
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
}
