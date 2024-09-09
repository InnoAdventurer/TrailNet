// backend/routes/weatherRoutes.js

import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Route to get weather by GPS coordinates
router.get('/current', async (req, res) => {
  const { lat, lon } = req.query; // Expecting latitude and longitude as query parameters

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: OPENWEATHERMAP_API_KEY,
        units: 'metric', // or 'imperial' for Fahrenheit
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

router.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query; // Expecting latitude and longitude as query parameters

  try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: {
              lat,
              lon,
              units: 'metric', // Get temperature in Celsius
              appid: OPENWEATHERMAP_API_KEY,
          }
      });

      // Extract data for 5 days at 12:00 PM (noon) to simulate daily forecast
      const dailyForecast = response.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );

      res.json(dailyForecast);
  } catch (error) {
      console.error('Error fetching weather forecast:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;