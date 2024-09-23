// frontend/src/Page/JoinEventPage2/JoinEventPage2.tsx

import './JoinEventPage2.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import event images
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

const apiUrl = process.env.VITE_BACKEND_URL;

interface Event {
  event_id: number;
  event_name: string;
  event_date: string;
  location: string;
  activity_type: string;
}

function JoinEventPage2() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Parse query parameters (includes latitude, longitude, activityType, dateRange)
  const params = new URLSearchParams(location.search);
  const latitude = params.get("latitude");
  const longitude = params.get("longitude");
  const activityType = params.get("activityType");
  const dateRange = params.get("dateRange");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Send all filters (GPS coordinates, activity type, date range) to the backend
        const response = await axios.post(`${apiUrl}/api/events/more`, {
          latitude: latitude || null, // Send null if no GPS provided
          longitude: longitude || null,
          activityType: activityType || null, // Send null if no activity type provided
          dateRange: dateRange || null, // Send null if no date range provided
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [latitude, longitude, activityType, dateRange]);

  // Helper function to map activity type and event ID to an image
  const getEventPicture = (activityType: string, event_id: number) => {
    const idMod = (event_id % 4) + 1;
    switch (activityType) {
      case 'Cycling':
        return [Cycling_1, Cycling_2, Cycling_3, Cycling_4][idMod - 1];
      case 'Hiking':
        return [Hiking_1, Hiking_2, Hiking_3, Hiking_4][idMod - 1];
      case 'Jogging':
        return [Jogging_1, Jogging_2, Jogging_3, Jogging_4][idMod - 1];
      default:
        return Hiking_1; // Default fallback image
    }
  };

  const generateHeaderMessage = () => {
    if (latitude && longitude) {
      return `Events near your location (${latitude}, ${longitude})`;
    } else if (activityType) {
      return `Events for ${activityType}`;
    } else if (dateRange) {
      const readableDateRange = parseDateRange(dateRange);
      return `Events happening ${readableDateRange}`;
    } else {
      return "Showing all upcoming events";
    }
  };

  const parseDateRange = (dateRange: string | null) => {
    switch (dateRange) {
      case 'Today':
        return 'today';
      case 'Next7days':
        return 'in the next 7 days';
      case 'Over7days':
        return 'after the next 7 days';
      default:
        return '';
    }
  };

  return (
    <div className="joineventpage2-container">
      <div className="search-container">
        <div className="back">
          <Link to="/eventpage"><IoIosArrowBack /></Link>
        </div>
        <input type="text" placeholder="Search" className="search" />
        <FiSearch className="search-icon" />
      </div>

      <h4>{generateHeaderMessage()}</h4> {/* Display the header message */}

      <div className="events-list">
        {loading ? (
          <div>Loading events...</div>
        ) : (
          <>
            {events.length > 0 ? (
              events.map(event => (
                <Link to={`/joineventpage3/${event.event_id}`} key={event.event_id} className="event-card-link">
                  <div className="event-card">
                    <img src={getEventPicture(event.activity_type, event.event_id)} alt={event.event_name} className="event-image" />
                    <div className="event-details">
                      <div className="event-date">{new Date(event.event_date).toLocaleDateString()}</div>
                      <div className="event-name">{event.event_name}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-events-message">
                <p>No events found for the selected filters.</p>
                <Link to="/createeventpage">
                  <button className="create-event-btn">Create an Event</button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default JoinEventPage2;