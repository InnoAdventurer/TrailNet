// backend/controllers/osmStaticController.js

import osmsm from 'osm-static-maps';

const generateGeoJSON = (lat, lon) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat], // GeoJSON uses [longitude, latitude]
      },
      properties: {},
    },
  ],
});

export const generateStaticMap = async (req, res) => {
  const { latitude, longitude, zoom = 14, size = '600x400' } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const [width, height] = size.split('x').map(Number);

  if ([lat, lon, width, height].some(isNaN)) {
    return res.status(400).json({ error: 'Invalid latitude, longitude, or size parameters' });
  }

  const geojson = generateGeoJSON(lat, lon);

  try {
    const imageBuffer = await osmsm({ geojson, width, height, zoom });

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="static-map.png"',
      'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
  } catch (error) {
    console.error('Map generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate map', details: error.message });
  }
};