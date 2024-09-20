// frontend/src/Page/WeatherPage/WeatherPage.tsx

import './WeatherPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ErrorContext } from '../../contexts/ErrorContext'; // Import ErrorContext for error handling

const apiUrl = process.env.VITE_BACKEND_URL;

function WeatherPage() {
  const { setError } = useContext(ErrorContext); // Use error handling context
  const [forecast, setForecast] = useState<any[]>([]); // State to store the weather forecast data
  const [latitude, setLatitude] = useState(-34.41966); // Default latitude (e.g., Wollongong)
  const [longitude, setLongitude] = useState(150.90676); // Default longitude (e.g., Wollongong)

  const today = new Date();
  const todayDate = today.getDate();

  // Fetch the 5-day weather forecast from the backend
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/weather/forecast`, {
          params: {
            lat: latitude,
            lon: longitude,
          },
        });
        setForecast(response.data.slice(0, 5)); // Get only 5 days forecast
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
        setError('Error fetching weather forecast. Please try again.'); // Set error message
      }
    };

    fetchForecast();
  }, [latitude, longitude, setError]);

  // Generate days of the week starting from today
  const getDaysOfWeek = () => {
    const weekDays = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Use Sunday as the start day
    for (let i = 0; i < 5; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i); // Add i days to the current day
      weekDays.push(dayNames[nextDay.getDay()]); // Get the day name (0 = Sunday, 6 = Saturday)
    }
    return weekDays;
  };

  // Generate dates for the next 5 days
  const getWeekDates = () => {
    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i); // Add i days to the current day
      weekDates.push(nextDay.getDate());
    }
    return weekDates;
  };

  const weekDays = getDaysOfWeek();
  const weekDates = getWeekDates();

  return (
    <div className="weatherpage-container">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Weather Conditions</h2>
      </div>

      <div className="vertical-weather-table">
        {forecast.length > 0 ? (
          forecast.map((day, index) => (
            <div key={index} className="forecast-row">
              <div className="forecast-column">
                <div className={`day ${weekDates[index] === todayDate ? 'active' : ''}`}>
                  {weekDays[index]}
                </div>
                <div className={`date ${weekDates[index] === todayDate ? 'active' : ''}`}>
                  {weekDates[index]}
                </div>
              </div>
              <div className="forecast-column">
                <div className="temperature">
                  {day.temperature}°C
                </div>
                <div className="weather-info">
                  <span>{day.condition}</span>
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                    alt={day.condition} 
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading weather data...</div>
        )}
      </div>

      <div className="attribution">
        <p>Weather data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>.</p>
      </div>
    </div>
  );
}

export default WeatherPage;
