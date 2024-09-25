// backend\controllers\mapController.js

import axios from 'axios';

export const searchAddress = async (req, res) => {
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
};

// Fetch GPS coordinates for a given human-readable location
export const getCoordinatesForLocation = async (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ success: false, message: "Location is required" });
  }

  try {
    // Query Nominatim API to fetch coordinates for the given location
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1,
        addressdetails: 1
      }
    });

    if (response.data.length === 0) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const { lat, lon, display_name } = response.data[0];

    // Parse display name to stop at the first comma
    const parsedDisplayName = display_name.split(',')[0];

    return res.status(200).json({
      success: true,
      coordinates: { lat, lon },
      display_name: parsedDisplayName
    });
  } catch (error) {
    console.error('Error fetching coordinates from OpenStreetMap:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Reverse geocoding: Fetch location for given GPS coordinates
export const getLocationForCoordinates = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Latitude and Longitude are required" });
  }

  try {
    // Query Nominatim API for reverse geocoding
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1
      }
    });

    if (!response.data || !response.data.display_name) {
      return res.status(404).json({ success: false, message: 'Location not found for given coordinates' });
    }

    const { display_name } = response.data;

    // Parse display name to stop at the first comma
    const parsedDisplayName = display_name.split(',')[0];

    return res.status(200).json({
      success: true,
      location: parsedDisplayName,
      full_address: display_name  // Return the full address in case needed
    });
  } catch (error) {
    // Check if the error is related to the "routable point" issue (error code 2010)
    if (error.response && error.response.data.error.code === 2010) {
      console.error('Routable point not found:', error.response.data.error.message);
      return res.status(400).json({ error: 'Routable point not found for this location.' });
    } else {
      // Log and return a generic error if it's a different issue
      console.error('Error calling OpenRouteService API:', error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Failed to calculate distance due to an internal error.' });
    }
  }
};

// Calculate distance with OpenRouteServiceAPI
export const calculateDistance = async (req, res) => {
  const { startCoords, endCoords } = req.body;

  if (!startCoords || !endCoords) {
    return res.status(400).json({ error: 'Coordinates missing' });
  }

  try {
    const response = await axios.post('https://api.openrouteservice.org/v2/directions/foot-walking', {
      coordinates: [
        [startCoords[1], startCoords[0]], // [longitude, latitude]
        [endCoords[1], endCoords[0]]      // [longitude, latitude]
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTESERVICE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    // Extract the distance from the response
    const distance = response.data.routes[0].summary.distance;

    // Send the distance back to the client
    res.status(200).json({ distance });
  } catch (error) {
    console.error('Error calling OpenRouteService API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
};