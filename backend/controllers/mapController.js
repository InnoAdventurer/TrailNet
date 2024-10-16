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

// Core reverse geocoding logic using OpenRouteService
export const fetchLocationName = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    throw new Error('Latitude and Longitude are required');
  }

  try {
    const response = await axios.get(
      'https://api.openrouteservice.org/geocode/reverse',
      {
        params: {
          api_key: process.env.OPENROUTESERVICE_API_KEY,
          'point.lat': latitude,
          'point.lon': longitude,
          size: 1, // Limit results to one
          layers: 'localadmin', // Focus on local admin layers
          'boundary.country': 'AUS', // Restrict to Australia
        },
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const features = response.data.features;
    if (!features || features.length === 0) {
      throw new Error('Location not found for the given coordinates.');
    }

    const { label } = features[0].properties;
    const parsedDisplayName = label.split(',')[0];

    return {
      success: true,
      location: parsedDisplayName,
      full_address: label,
    };
  } catch (error) {
    console.error('Error fetching location:', error.message, error.response?.data);
    throw new Error('Failed to fetch location');
  }
};

// Route handler for API calls
export const getLocationForCoordinates = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const locationData = await fetchLocationName(latitude, longitude);
    res.status(200).json(locationData);
  } catch (error) {
    console.error('Error in reverse geocoding API:', error.message);
    res.status(500).json({ success: false, message: error.message });
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