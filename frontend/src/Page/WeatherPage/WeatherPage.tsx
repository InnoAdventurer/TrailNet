import './WeatherPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.VITE_BACKEND_URL

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
        const response = await axios.get(`${apiUrl}/api/weather/forecast`, {
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
    const todayClone = new Date(today);
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
                <div>{day.temperature}°C</div> {/* Adjusted to match new structure */}
                <div className="weather-info">
                  <span>{day.condition}</span> {/* Adjusted to match new structure */}
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                    alt={day.condition} 
                  /> {/* Adjusted to match new structure */}
                </div>
              </div>
            ))}
          </div>
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
