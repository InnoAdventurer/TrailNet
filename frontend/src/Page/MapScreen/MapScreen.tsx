// frontend\src\Page\MapScreen\MapScreen.tsx

import { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import './MapScreen.css';
import { FiSearch, FiCrosshair, FiNavigation2 } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import ReactDOMServer from 'react-dom/server';
import axios from '../../utils/axiosInstance';
import { ErrorContext } from '../../contexts/ErrorContext';
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon using react-icons
const centerPinIcon = new L.DivIcon({
  html: ReactDOMServer.renderToString(<FiCrosshair size={24} color="#48AEE1" />),
  className: 'custom-center-pin', // Optional: Add custom CSS class
  iconSize: [35, 35],  // Size of the icon
  iconAnchor: [17, 17] // Anchor to the center of the icon
});

function MapScreen() {
  const { setError } = useContext(ErrorContext);
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>(''); // For reverse geocoded location
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [lastClickedSuggestion, setLastClickedSuggestion] = useState<any>(null);
  const [latitude, setLatitude] = useState<number>(-34.4251);
  const [longitude, setLongitude] = useState<number>(150.8931);
  const [useLiveLocation, setUseLiveLocation] = useState<boolean>(true);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const mapRef = useRef<L.Map | null>(null); // Create map reference

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hook to handle map movement and refetch events/weather
  const MapEventsHandler = () => {
    const onMoveEnd = async (event: any) => {
      const { lat, lng } = event.target.getCenter();
      setLatitude(lat);
      setLongitude(lng);
      await fetchLocationName(lat, lng); // Fetch location on map movement
    };
  
    useMapEvents({
      moveend: (event) => {
        // Call the async function within the promise handler.
        onMoveEnd(event).catch((error) =>
          console.error('Error during map movement handling:', error)
        );
      },
    });
  
    return null;
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (useLiveLocation) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
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
      setError('Geolocation is not supported by this browser.');
    }
  };

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await axios.post(
        `/api/map/reverse-geocode`,
        { latitude: lat, longitude: lon },
      );
      setLocationName(response.data.location || 'Unknown Location');
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Unknown Location');
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`/api/weather/current`, {
        params: { lat: latitude, lon: longitude },
      });

      setWeather(response.data);
    } catch (error) {
      handleAxiosError(error, 'Error fetching weather data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');
  
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.post(`/api/events/more`, {
          latitude,
          longitude,
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching event info. Please try again.');
      }
    };
    fetchEvents();
  }, [latitude, longitude, setError]);

  // Center the map when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], mapRef.current.getZoom()); // Update map view
    }
    fetchLocationName(latitude, longitude);
    fetchWeather();
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather();
    fetchLocationName(latitude, longitude); // Fetch location on initial load
  }, [latitude, longitude]);

  const handleAxiosError = (error: any, defaultMessage: string) => {
    console.error(error);
    setError(defaultMessage);
  };

  const handleMarkerClick = async (event: any) => {
    setSelectedEvent(event);
    try {
      const response = await axios.post(`/api/map/calculate-distance`, {
        startCoords: [latitude, longitude],
        endCoords: [event.latitude, event.longitude],
      });
      setDistance(response.data.distance);
    } catch (err) {
      const error = err as any;
      if (error.response) {
        if (error.response.status === 400) {
          console.error('Distance calculation error:', error.response.data.error);
          setDistance(null);
          setError('Distance calculation failed. This location is not routable.');
        } else {
          console.error('Error calculating distance:', error);
          setDistance(null);
          setError('An error occurred while calculating the distance.');
        }
      } else {
        // Handle unknown errors that are not Axios related
        console.error('Unknown error occurred:', error);
        setDistance(null);
        setError('An unexpected error occurred.');
      }
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`/api/map/search`, {
          params: { query },
        });
        setSuggestions(response.data); // Ensure this gets updated
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Error fetching map suggestions. Please try again.');
      }
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(e.target.value); // Ensure this gets called
    }, 500);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setUseLiveLocation(false);
    setLastClickedSuggestion(suggestion);
    setSuggestions([]);
    fetchLocationName(parseFloat(suggestion.lat), parseFloat(suggestion.lon)); // Fetch location on search
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (lastClickedSuggestion) {
      setLatitude(parseFloat(lastClickedSuggestion.lat));
      setLongitude(parseFloat(lastClickedSuggestion.lon));
      setUseLiveLocation(false);
    } else if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleCenterMap = () => {
    setUseLiveLocation(true);
    getUserLocation();
  };

  const formatDate = (isoString: string) => 
    new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

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
      <div className="map-container">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {events.map((event, index) => (
            <Marker
              key={event.id || index}
              position={[event.latitude, event.longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(event),
              }}
            >
              <Popup>
                <div>
                  <h3>{event.event_name}</h3>
                  <p>{event.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Center marker showing the current GPS coordinates */}
          <Marker position={[latitude, longitude]} icon={centerPinIcon}>
            <Popup>
              <div><b>Current Center</b></div>
              <div>Lat: {latitude}, Lng: {longitude}</div>
            </Popup>
          </Marker>

          <MapEventsHandler />

        </MapContainer>
        
        <div className="center-button">
          <button onClick={handleCenterMap}>
            <FiNavigation2 size={24} />
          </button>
        </div>
      </div>

      {selectedEvent && (
        <div className="event-info">
          <p><Link to={`/joineventpage3/${selectedEvent.event_id}`}>{selectedEvent.event_name}</Link></p>
          <p>Date: {formatDate(selectedEvent.event_date)}</p>
          <p>Time: {selectedEvent.start_time}</p>
          {distance !== null && <p>Distance: {distance} meters</p>}
        </div>
      )}
      
      <div>
        <h3>Weather Information for {locationName}</h3>
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
      <BottomNavBar />
    </div>
  );
}

export default MapScreen;