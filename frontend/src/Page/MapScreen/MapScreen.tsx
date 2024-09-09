// frontend\src\Page\MapScreen\MapScreen.tsx

import './MapScreen.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MapScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  // --------- Temporary usage for testing purpose --------
  // Define GPS coordinates as variables
  const [latitude, setLatitude] = useState(-34.41966); // Latitude for Wollongong
  const [longitude, setLongitude] = useState(150.90676); // Longitude for Wollongong

  // Calculate the bounding box for the map
  const bbox = `${longitude - 0.0015},${latitude - 0.0015},${longitude + 0.0015},${latitude + 0.0015}`;
  // --------- Temporary usage for testing purpose --------

  useEffect(() => {
    // Fetch weather data based on GPS coordinates from the backend
    const fetchWeather = async () => {
      try {
        const response = await axios.get('/backend_api/api/weather', {
          params: {
            lat: latitude,
            lon: longitude,
          },
        });
        const data = response.data;
        setWeather({
          temperature: data.main.temp,
          condition: data.weather[0].description,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fetch location data using the Nominatim API
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        setLatitude(parseFloat(location.lat));
        setLongitude(parseFloat(location.lon));
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FiSearch className="search-icon" />
          </button>
        </form>
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
            <div><b>Temperature:</b> {weather.temperature}°C</div>
            <div><b>Condition:</b> {weather.condition}</div>
          </div>
        ) : (
          <div>Loading weather data...</div>
        )}
      </div>
    </div>
  );
}

export default MapScreen;
