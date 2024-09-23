// frontend/src/Page/EventPage/EventPage.tsx

import React, { useState, useEffect } from 'react';
import './EventPage.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { MdPersonSearch } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import BottomNavBar from '../../Components/BottomNavBar/BottomNavBar';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import static images
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

// Backend API URL
const apiUrl = process.env.VITE_BACKEND_URL;

interface Event {
  event_id: number;
  event_name: string;
  event_date: string;
  location: string;
  activity_type: string;
}

function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/events/upcoming`, {});
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

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

  return (
    <div className="eventpage-container flex">
      <div className="main-content">
        <div className="search-container">
          <Link to="/homepage">
            <div className="back"><IoIosArrowBack /></div>
          </Link>
          <input 
            type="text" 
            placeholder="Search" 
            className="search"
            onFocus={() => setLoadingSearch(true)}
            onBlur={() => setLoadingSearch(false)}
          />
          <FiSearch className="search-icon" />
          {loadingSearch && <p>Searching...</p>}
        </div>

        <div className="join">
          <div>
            <p>Discover Events to<br />meet new people!</p>
            <Link to="/joineventpage1"><button>Join Events</button></Link>
          </div>
          <MdPersonSearch className="person-search" />
        </div>

        <div className="create">
          <IoCreateOutline className="create-event" />
          <div>
            <p>Create Events to<br />invite your friends!</p>
            <Link to="/createeventpage"><button>Create Events</button></Link>
          </div>
        </div>

        <div className="browse">
          <p>Browse events</p>
          <div className="events-container">
            {loadingEvents ? (
              <p>Loading events...</p>
            ) : (
              <>
                {events.map(event => (
                  <Link to={`/joineventpage3/${event.event_id}`} key={event.event_id} className="event-card-link">
                    <div className="event-card">
                      <img
                        src={getEventPicture(event.activity_type, event.event_id)}
                        alt={event.event_name}
                        className="eventpic"
                      />
                      <div>{event.event_name}</div>
                    </div>
                  </Link>
                ))}

                {/* More Events button */}
                <Link to="/joineventpage2">
                  <div className="event-card more-event">
                    <div className="more-event-text">More Events</div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}

export default EventPage;