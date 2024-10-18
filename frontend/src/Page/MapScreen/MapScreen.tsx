// frontend\src\Page\MapScreen\MapScreen.tsx

import { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import './MapScreen.css';
import { FiSearch, FiCrosshair, FiNavigation2 } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import ReactDOMServer from 'react-dom/server';
import redMarkerIcon from '../../assets/Picture/MapPins/marker-icon-2x-red.png'; 
import blueMarkerIcon from '../../assets/Picture/MapPins/marker-icon-2x-blue.png'; 
import greenMarkerIcon from '../../assets/Picture/MapPins/marker-icon-2x-green.png'; 
import axios from '../../utils/axiosInstance';
import { ErrorContext } from '../../contexts/ErrorContext';
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const centerPinIcon = new L.DivIcon({
  html: ReactDOMServer.renderToString(<FiCrosshair size={24} color="#48AEE1" />),
  className: 'custom-center-pin',
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

const redEventIcon = new L.Icon({
  iconUrl: redMarkerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenStartingPointIcon = new L.Icon({
  iconUrl: greenMarkerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueEventIcon = new L.Icon({
  iconUrl: blueMarkerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.4251, 150.8931]); // Map center state
  const [startCoords, setStartCoords] = useState<[number, number]>([-34.4251, 150.8931]); // Initial start point
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null); // Track the selected event's ID
  const [useLiveLocation, setUseLiveLocation] = useState<boolean>(true);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const mapRef = useRef<L.Map | null>(null);
  const wasManualMove = useRef<boolean>(false); // Track manual map movements
  const [popupOpen, setPopupOpen] = useState(false); // Popup open state

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceFetchLocationName = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Map event handler to detect movements and set starting points
  const MapEventsHandler = () => {
    useMapEvents({
      movestart: () => {
        wasManualMove.current = true;
        setPopupOpen(false); // Close any open popups
      },
      moveend: () => {
        const map = mapRef.current;
        if (!map) return;

        const { lat, lng } = map.getCenter();
        setLatitude(lat);
        setLongitude(lng);

        if (wasManualMove.current) {
          setTimeout(() => setStartCoords([lat, lng]), 500); // Update starting point after 0.5s
          wasManualMove.current = false;
        }
      },
    });

    return null;
  };

  const handleLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setMapCenter([latitude, longitude]);

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
          }
        },
        () => setError('Unable to access live location.')
      );
    } else {
      setError('Geolocation not supported.');
    }
  };

  const handleMarkerClick = (event: any) => {
    setSelectedEventId(event.event_id);
    setStartCoords([latitude, longitude]);

    axios.post(`/api/map/calculate-distance`, {
      startCoords: [latitude, longitude],
      endCoords: [event.latitude, event.longitude],
    })
      .then((response) => setRouteCoordinates(response.data.routeCoordinates))
      .catch(() => setError('Error calculating route.'));
  };

  // Fetch events
  useEffect(() => {
    axios.post(`/api/events/more`, { latitude, longitude })
      .then((response) => setEvents(response.data.events))
      .catch(() => setError('Error fetching events.'));
  }, [latitude, longitude]);

  const fetchLocationName = async (lat: number, lon: number) => {
    if (debounceFetchLocationName.current) clearTimeout(debounceFetchLocationName.current);

    debounceFetchLocationName.current = setTimeout(async () => {
      try {
        const response = await axios.post(`/api/map/reverse-geocode`, { latitude: lat, longitude: lon });
        setLocationName(response.data.location || 'Unknown Location');
      } catch {
        setLocationName('Unknown Location');
      }
    }, 500);
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`/api/weather/current`, {
        params: { lat: latitude, lon: longitude },
      });
      setWeather(response.data);
    } catch {
      setError('Error fetching weather data.');
    }
  };

  // Center map and fetch location/weather when coordinates change
  useEffect(() => {
    if (mapRef.current) mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
    fetchLocationName(latitude, longitude);
    fetchWeather();
  }, [latitude, longitude]);

  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`/api/map/search`, { params: { query } });
        setSuggestions(response.data);
      } catch {
        setError('Error fetching map suggestions.');
      }
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => fetchSuggestions(e.target.value), 500);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setSuggestions([]);
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
        <Link to="/homepage">
          <IoIosArrowBack />
        </Link>
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

          {/* Start Point Marker */}
          {selectedEventId && (
            <Marker position={startCoords} icon={centerPinIcon}>
              <Popup>
                <b>Starting Point</b>
                <div>Lat: {startCoords[0]} <br/> Lng: {startCoords[1]}</div>
              </Popup>
            </Marker>
          )}

          {/* Render Event Markers */}
          {events.map((event) => (
            <Marker
              key={event.event_id}
              position={[event.latitude, event.longitude]}
              icon={selectedEventId === event.event_id ? redEventIcon : blueEventIcon}
              eventHandlers={{ click: () => handleMarkerClick(event) }}
            >
              <Popup>
                <h3>{event.event_name}</h3>
              </Popup>
            </Marker>
          ))}

          {/* Render route as a polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="blue" />
          )}

          {/* Center Pin Icon */}
          <Marker position={mapCenter} icon={greenStartingPointIcon} />

          {/* Map Events Handler */}
          <MapEventsHandler />

        </MapContainer>
        
        <div className="center-button">
          <button onClick={handleLiveLocation}>
            <FiNavigation2 size={24} />
          </button>
        </div>
      </div>

      {selectedEvent && (
        <div className="event-info">
          <p><Link to={`/joineventpage3/${selectedEvent.event_id}`}>{selectedEvent.event_name}</Link></p>
          <p>Date: {formatDate(selectedEvent.event_date)}</p>
          <p>Time: {selectedEvent.start_time}</p>
          {distance !== null && <p>Walking distance: {distance} meters</p>}
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