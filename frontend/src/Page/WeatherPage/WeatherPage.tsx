// frontend/src/Page/WeatherPage/WeatherPage.tsx

import './WeatherPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from '../../utils/axiosInstance';
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import { ErrorContext } from '../../contexts/ErrorContext'; // Assuming you're using ErrorContext for error handling
import TopNavBar from "../../Components/TopNavBar/TopNavBar";


function WeatherPage() {
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Corrected to start from Sunday
  const today = new Date();
  const todayDate = today.getDate();
  const todayDayIndex = today.getDay(); // Get the index of the current day (0-6, Sunday-Saturday)

  const { setError } = useContext(ErrorContext); // Use the error context

  const [forecast, setForecast] = useState<any[]>([]); // State to store the weather forecast data
  const [latitude, setLatitude] = useState<number | null>(null); // State for latitude
  const [longitude, setLongitude] = useState<number | null>(null); // State for longitude
  const [locationName, setLocationName] = useState<string>('Current Location'); // New state for location name

  // Function to get the user's current GPS coordinates
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Handle the specific geolocation error types
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Permission denied. Please enable location services.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Position unavailable. Please check your GPS settings.');
              break;
            case error.TIMEOUT:
              setError('Location request timed out. Please try again.');
              break;
            default:
              setError('An unknown error occurred. Please try again.');
              break;
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  };

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await axios.post('/api/map/reverse-geocode', { latitude: latitude, longitude: longitude });
      setLocationName(response.data.location || 'Unknown Location');
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Unknown Location');
    }
  };

  useEffect(() => {
    // Fetch the user's live GPS coordinates
    getUserLocation();

    const fetchForecast = async () => {
      try {
        if (latitude !== null && longitude !== null) {
          const response = await axios.get(`/api/weather/forecast`, {
            params: {
              lat: latitude,
              lon: longitude,
            },
          });
          setForecast(response.data);
          fetchLocationName(latitude, longitude);
        }
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
        setError('Error fetching weather forecast. Please try again.');
      }
    };

    if (latitude !== null && longitude !== null) {
      fetchForecast();
    }
  }, [latitude, longitude, setError]); // Fetch weather data whenever the coordinates change

  // Generate dates starting from today and the next 4 days
  const getUpcomingDates = () => {
    const upcomingDates = [];
    for (let i = 0; i < 5; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i); // Increment the date by i days
      upcomingDates.push(futureDate);
    }
    return upcomingDates;
  };

  const upcomingDates = getUpcomingDates();

  return (
    <div className="weatherpage-container">
      <TopNavBar />
      <h3>Weather for {locationName}</h3>
      <div className="vertical-weather-table">
        {forecast.length > 0 ? (
          forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="forecast-row">
              <div className="day-column">
                {/* Show the day of the week, ensuring today is included */}
                <div className="day">{daysOfWeek[(todayDayIndex + index) % 7]}</div>
                {/* Show the corresponding date, with a blue circle around today's date */}
                <div className={`date ${upcomingDates[index].getDate() === todayDate ? 'active' : ''}`}>
                  {upcomingDates[index].getDate()}
                </div>
              </div>
              <div className="forecast-column">
                <div className="temperature">{day.temperature}°C</div>
                <div className="weather-info">
                  <span>{day.condition}</span>
                  <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.condition} />
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
      <BottomNavBar />
    </div>
  );
}

export default WeatherPage;