// frontend\src\Page\JoinEventPage3\JoinEventPage3.tsx

import './JoinEventPage3.css';
import { useParams, Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { PiMapPinArea } from "react-icons/pi";
import { useEffect, useState } from 'react';
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

function JoinEventPage3() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/events/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [id]);

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

  // Parse date format
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', // 2024
      month: 'short',   // 'Oct'
      day: 'numeric',  // 19
    };
    
    return date.toLocaleDateString(undefined, options);
  };


  if (!event) {
    return <div>Loading event...</div>;
  }

  return (
    <div className="joineventpage3-container">
      <div className="search-container">
        <div className="back">
          <Link to="/joineventpage2"><IoIosArrowBack /></Link>
        </div>
      </div>

      <div className="event-details-container">
        <img src={getEventPicture(event.activity_type, event.event_id)} alt={event.event_name} className="event-detail-image" />
        <div className="event-detail-info">
          <h2 className="event-detail-name">{event.event_name}</h2>
          <p className="event-detail-date"><FaRegCalendarCheck /> {formatDate(event.event_date)}</p>
          <p className="event-detail-location"><PiMapPinArea /> {event.location}</p>
        </div>
      </div>
    </div>
  );
}

export default JoinEventPage3;