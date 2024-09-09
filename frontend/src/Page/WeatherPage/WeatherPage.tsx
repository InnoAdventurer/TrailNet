// frontend\src\Page\WeatherPage\WeatherPage.tsx

import './WeatherPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function WeatherPage() {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  const todayDate = today.getDate();
  
  const [forecast, setForecast] = useState<any[]>([]); // State to store the weather forecast data
  const [latitude, setLatitude] = useState(-34.41966); // Default latitude (e.g., Wollongong)
  const [longitude, setLongitude] = useState(150.90676); // Default longitude (e.g., Wollongong)

  // Fetch the weekly weather forecast from the backend
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get('/backend_api/api/weather/forecast', {
          params: {
            lat: latitude,
            lon: longitude,
          },
        });
        setForecast(response.data);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      }
    };

    fetchForecast();
  }, [latitude, longitude]);

  // Generate dates for the week starting from Monday
  const getWeekDates = () => {
    // Clone today's date to avoid modifying the original `today` object
    const todayClone = new Date(today);
    
    // Calculate the start of the week (Monday)
    const dayIndex = todayClone.getDay(); // 0 for Sunday, 6 for Saturday
    const startOfWeek = new Date(todayClone);
    startOfWeek.setDate(todayClone.getDate() - (dayIndex === 0 ? 6 : dayIndex - 1)); // Adjust so Monday is the start
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      weekDates.push(currentDay.getDate());
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="weatherpage-container">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Weather Conditions</h2>
      </div>

      <div className="week-table">
        <div className="week-days">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day">
              {day}
            </div>
          ))}
        </div>
        <div className="week-dates">
          {weekDates.map((date, index) => (
            <div key={index} className={`date ${date === todayDate ? 'active' : ''}`}>
              {date}
            </div>
          ))}
        </div>
      </div>

      <div className="weather-container">
        {forecast.length > 0 ? (
          <div className="forecast-table">
            {forecast.slice(0, 7).map((day, index) => (
              <div key={index} className="forecast-day">
                <div><b>{daysOfWeek[index]}</b></div>
                <div>{Math.round(day.main.temp)}°C</div>
                <div>{day.weather[0].description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading weather data...</div>
        )}
      </div>
    </div>
  );
}

export default WeatherPage;
