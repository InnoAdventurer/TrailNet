// frontend\src\Page\MapScreen\MapScreen.tsx

import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import './MapScreen.css';
import { FiSearch, FiCrosshair } from "react-icons/fi"; // Import FiCrosshair for center icon
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { ErrorContext } from '../../contexts/ErrorContext'; // Import ErrorContext for error handling

const apiUrl = process.env.VITE_BACKEND_URL;

function MapScreen() {
  const { setError } = useContext(ErrorContext);
  const [weather, setWeather] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [lastClickedSuggestion, setLastClickedSuggestion] = useState<any>(null); // Track last clicked suggestion
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [useLiveLocation, setUseLiveLocation] = useState<boolean>(true); // Flag to control GPS updates

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Function to get the user's current GPS coordinates
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Only update location if using live location
          if (useLiveLocation) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          }
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

  useEffect(() => {
    // Fetch user's current location when component mounts
    getUserLocation();

    const fetchWeather = async () => {
      try {
        if (latitude !== null && longitude !== null) {
          const response = await axios.get(`${apiUrl}/api/weather/current`, {
            params: { lat: latitude, lon: longitude },
          });

          setWeather({
            temperature: response.data.temperature,
            condition: response.data.condition,
            icon: response.data.icon,
          });
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data. Please try again.');
      }
    };

    if (latitude !== null && longitude !== null) {
      fetchWeather();
    }
  }, [latitude, longitude, setError, useLiveLocation]); // Ensure this runs when location or flag changes

  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`${apiUrl}/api/map/search`, {
          params: { query },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Error fetching map suggestions. Please try again.');
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear the previous timeout
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(query); // Fetch suggestions after 0.5s delay
    }, 500);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.display_name); // Set the selected suggestion to the input
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setUseLiveLocation(false); // Disable live location when a search is made
    setLastClickedSuggestion(suggestion); // Save the last clicked suggestion
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // If there is a previously clicked suggestion, use it to update the map
    if (lastClickedSuggestion) {
      setLatitude(parseFloat(lastClickedSuggestion.lat));
      setLongitude(parseFloat(lastClickedSuggestion.lon));
      setUseLiveLocation(false); // Disable live location since we're manually setting location
    } else {
      // If no suggestion has been clicked, check if there are current suggestions
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]); // Automatically select the first suggestion if available
      }
    }
  };

  const handleCenterMap = () => {
    setUseLiveLocation(true); // Re-enable live location updates
    getUserLocation();
  };

  // Dynamically calculate the bounding box for the map
  const bbox = `${longitude !== null ? longitude - 0.0015 : 0},${latitude !== null ? latitude - 0.0015 : 0},${longitude !== null ? longitude + 0.0015 : 0},${latitude !== null ? latitude + 0.0015 : 0}`;

  return (
    <div className="mapscreen-container flex">
      <div className="header">
        <Link to="/homepage"><div className="back"><IoIosArrowBack /></div></Link>
        <h2>Map</h2>
      </div>
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-button">
            <FiSearch className="search-icon" />
          </button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="map" style={{ height: "250px", width: "100%", position: "relative" }}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`}
          style={{ border: 0 }}
        />
        {/* Add a center button to recenter the map */}
        <button className="center-button" onClick={handleCenterMap}>
          <FiCrosshair size={24} />
        </button>
      </div>
      <div className="table flex">
        <div><b>Activity:</b> Hiking</div>
        <div><b>Distance:</b> 25km</div>
        <div><b>Event:</b> Birthday Hiking Camp</div>
      </div>
      <div>
        <h3>Weather Information</h3>
        {weather ? (
          <div>
            <div><b>Temperature: </b> {weather.temperature}°C</div>
            <div className="weather-info">
              <b>Condition: &nbsp;</b> {weather.condition} 
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.condition} />
            </div>
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

export default MapScreen;
