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
  creator: string;
}

function JoinEventPage3() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('Not Going');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(`${apiUrl}/api/events/${id}`, config);
      const { event, participants, userParticipation } = response.data;

      setEvent(event[0]);
      setParticipants(participants);
      setStatus(userParticipation.status);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const toggleParticipation = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const newStatus = status === 'Going' ? 'Not Going' : 'Going';
      await axios.post(`${apiUrl}/api/events/toggle-participation`, { event_id: id, status: newStatus }, config);

      setStatus(newStatus);  // Update the status locally
      fetchEventData();  // Refetch event data, including participants
    } catch (error) {
      console.error('Error toggling participation:', error);
    }
  };

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
        return Hiking_1;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return <div>Loading event...</div>;

  return (
    <div className="joineventpage3-container">
      <div className="search-container">
        <div className="back">
          <Link to="/joineventpage2"><IoIosArrowBack /></Link>
        </div>
      </div>

      <div className="event-details-container">
        <img src={getEventPicture(event!.activity_type, event!.event_id)} alt={event!.event_name} className="event-detail-image" />
        <div className="event-detail-info">
          <h2 className="event-detail-name">{event!.event_name}</h2>
          <p className="event-detail-creator">Created by: {event!.creator}</p>
          <p className="event-detail-date"><FaRegCalendarCheck /> {formatDate(event!.event_date)}</p>
          <p className="event-detail-location"><PiMapPinArea /> {event!.location}</p>
          <button onClick={toggleParticipation}>
            {status === 'Going' ? 'Revoke Join' : 'Join Event'}
          </button>
        </div>
      </div>

      <div className="participants-container">
        <h3>Participants Going</h3>
        {participants.length === 0 ? (
          <p>No participants yet.</p>
        ) : (
          participants.map((participant) => (
            <div key={participant.user_id}>{participant.username}</div>
          ))
        )}
      </div>
    </div>
  );
}

export default JoinEventPage3;