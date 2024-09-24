// backend/routes/weatherRoutes.js

import { Router } from 'express';
import { getCurrentWeather, getWeatherForecast } from '../controllers/weatherController.js';

const router = Router();

// Route to get current weather
router.get('/current', getCurrentWeather);

// Route to get 5-day weather forecast
router.get('/forecast', getWeatherForecast);

export default router;