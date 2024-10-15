// frontend/src/Page/JoinEventPage1/JoinEventPage1.tsx

import './JoinEventPage1.css';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from '../../utils/axiosInstance';

// Importing activity images
import Cycling_1 from '../../assets/Picture/Event/Cycling_1.webp';
import Cycling_2 from '../../assets/Picture/Event/Cycling_2.webp';
import Cycling_3 from '../../assets/Picture/Event/Cycling_3.webp';
import Cycling_4 from '../../assets/Picture/Event/Cycling_4.webp';

import Hiking_1 from '../../assets/Picture/Event/Hiking_1.webp';
import Hiking_2 from '../../assets/Picture/Event/Hiking_2.webp';
import Hiking_3 from '../../assets/Picture/Event/Hiking_3.webp';
import Hiking_4 from '../../assets/Picture/Event/Hiking_4.webp';

import Jogging_1 from '../../assets/Picture/Event/Jogging_1.webp';
import Jogging_2 from '../../assets/Picture/Event/Jogging_2.webp';
import Jogging_3 from '../../assets/Picture/Event/Jogging_3.webp';
import Jogging_4 from '../../assets/Picture/Event/Jogging_4.webp';

// Importing date images
import Today from '../../assets/Picture/Days/Today.webp';
import Next7days from '../../assets/Picture/Days/Next7days.webp';
import Over7days from '../../assets/Picture/Days/Over7days.webp';

function JoinEventPage1() {
  const [activityType, setActivityType] = useState('Cycling');
  const [dateRange, setDateRange] = useState('Today');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activityImage, setActivityImage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch live location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          setLatitude(latitude);
          setLongitude(longitude);

          try {
            // Fetch location name using reverse geocode
            const response = await axios.post('/api/map/reverse-geocode', {
              latitude,
              longitude,
            });
            setLocationName(response.data.location);
          } catch (err) {
            console.error('Error fetching location name:', err);
            setError('Unable to get location name.');
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to retrieve location. Check GPS.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation not supported by your browser.');
    }
  }, []);

  // Monitor the size of the image container using ResizeObserver
  useEffect(() => {
    const fetchStaticMap = async (width: number, height: number) => {
      if (latitude !== null && longitude !== null) {
        try {
          const response = await axios.get('/api/osmstaticmaps/pic', {
            params: { latitude, longitude, zoom: 14, size: `${width}x${height}` },
            responseType: 'blob',
          });

          const imageUrl = URL.createObjectURL(response.data);
          setMapImageUrl(imageUrl);

          return () => URL.revokeObjectURL(imageUrl); // Cleanup blob URL
        } catch (err) {
          console.error('Error fetching map image:', err);
          setError('Failed to load map image.');
        }
      }
    };

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height) {
          fetchStaticMap(Math.round(width), Math.round(height));
        }
      }
    });

    if (imageContainerRef.current) {
      observer.observe(imageContainerRef.current);
    }

    return () => {
      if (imageContainerRef.current) {
        observer.unobserve(imageContainerRef.current);
      }
    };
  }, [latitude, longitude]);

  const handleSearch = (type: string) => {
    switch (type) {
      case 'gps':
        navigate(`/joineventpage2?latitude=${latitude}&longitude=${longitude}`);
        break;
      case 'activity':
        navigate(`/joineventpage2?activityType=${activityType}`);
        break;
      case 'date':
        navigate(`/joineventpage2?dateRange=${dateRange}`);
        break;
      default:
        break;
    }
  };

  // Function to randomly select an image based on the event type
  const getRandomActivityImage = useCallback(() => {
    const images = {
      Cycling: [Cycling_1, Cycling_2, Cycling_3, Cycling_4],
      Hiking: [Hiking_1, Hiking_2, Hiking_3, Hiking_4],
      Jogging: [Jogging_1, Jogging_2, Jogging_3, Jogging_4],
    }[activityType] || [Cycling_1];

    const randomImage = images[Math.floor(Math.random() * images.length)];
    return randomImage;
  }, [activityType]);

  const getDateRangeImage = () => {
    const images: { [key: string]: string } = {
      Today,
      Next7days,
      Over7days,
    };
  
    return images[dateRange] || Today; // Default to Today image if not found
  };

  // useEffect to set the initial image on page load and whenever the activity type changes
  useEffect(() => {
    const selectedImage = getRandomActivityImage();
    setActivityImage(selectedImage);
  }, [getRandomActivityImage]);

  return (
    <div className="joineventpage1-container flex">
      <div className="search-container">
        <div className="back">
          <Link to="/eventpage">
            <IoIosArrowBack />
          </Link>
        </div>
        <input type="text" placeholder="Search" className="search" />
        <FiSearch className="search-icon" />
      </div>

      <div className="discover-section">
        <div className="discover-title">Discover event near {locationName || 'your location'}</div>
        <div className="map-container" ref={imageContainerRef} onClick={() => handleSearch('gps')}>
          {mapImageUrl ? (
            <img src={mapImageUrl} alt="Map" className="nearby" />
          ) : (
            <p>Fetching location...</p>
          )}
        </div>
      </div>

      <div className="discover-section">
        <div className="discover-title">
          Discover event by activity &nbsp;
          <select
            className="filter-select"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="Cycling">Cycling</option>
            <option value="Jogging">Jogging</option>
            <option value="Hiking">Hiking</option>
          </select>
        </div>
        {activityImage && (
          <img
            src={activityImage}
            alt="activity"
            className="nearby"
            onClick={() => handleSearch('activity')}
          />
        )}
      </div>

      <div className="discover-section">
        <div className="discover-title">
          Discover event by date &nbsp;
          <select
            className="filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Next7days">Next 7 days</option>
            <option value="Over7days">Over 7 days</option>
          </select>
        </div>
        <img
          src={getDateRangeImage()}
          alt="date"
          className="nearby"
          onClick={() => handleSearch('date')}
        />
      </div>
    </div>
  );
}

export default JoinEventPage1;