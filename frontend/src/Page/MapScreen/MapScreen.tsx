// frontend\src\Page\MapScreen\MapScreen.tsx

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MapScreen.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

const apiUrl = process.env.VITE_BACKEND_URL

function MapScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [latitude, setLatitude] = useState(-34.41966); // Latitude for Wollongong
  const [longitude, setLongitude] = useState(150.90676); // Longitude for Wollongong

  const bbox = `${longitude - 0.0015},${latitude - 0.0015},${longitude + 0.0015},${latitude + 0.0015}`;

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/weather/current`, {
          params: { lat: latitude, lon: longitude },
        });

        setWeather({
          temperature: response.data.temperature,
          condition: response.data.condition,
          icon: response.data.icon, // Save the icon code
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get('${apiUrl}/api/map/search', {
          params: { query }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
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
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]); // Automatically select the first suggestion if available
    }
  };

  return (
    <div className="mapscreen-container flex">
      <div className="header">
        <Link to="/homepage"><div className="back"><IoIosArrowBack /></div></Link>
        <h2>Map</h2>
      </div>
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            className="search"
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
      <div className="map" style={{ height: "250px", width: "100%" }}>
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
              <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.condition} />
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
