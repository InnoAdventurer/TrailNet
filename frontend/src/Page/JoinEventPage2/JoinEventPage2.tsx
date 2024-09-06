// frontend\src\Page\JoinEventPage2\JoinEventPage2.tsx

import './JoinEventPage2.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import joineventpage2_1 from './joineventpage2_1.png';
import joineventpage2_2 from './joineventpage2_2.png';
import joineventpage2_3 from './joineventpage2_3.png';

// Simulated data (this would normally come from an API call)
const events = [
  {
    id: 1,
    eventName: '10KM NIGHT RUN',
    eventDate: 'Sat, 20 Aug 6:00PM',
    eventLocation: 'Wollongong Beach',
    eventPicture: joineventpage2_1, // Use imported image
  },
  {
    id: 2,
    eventName: '20KM CYCLING',
    eventDate: 'Fri, 16 Sep 2:00PM',
    eventLocation: 'Stanwell Park',
    eventPicture: joineventpage2_2, // Use imported image
  },
  {
    id: 3,
    eventName: '15KM RUNNING',
    eventDate: 'Mon, 2 Oct 3:00PM',
    eventLocation: 'Stuart Park',
    eventPicture: joineventpage2_3, // Use imported image
  },
  // Add more events as needed
];

function JoinEventPage2() {
  return (
    <div className="joineventpage2-container">
      <div className="search-container">
        <div className="back">
          <Link to="/eventpage"><IoIosArrowBack /></Link>
        </div>
        <input type="text" placeholder="Search" className="search" />
        <FiSearch className="search-icon" />
      </div>

      <div className="events-list">
        {events.map(event => (
          <Link to={`/joineventpage3/${event.id}`} key={event.id} className="event-card-link">
            <div className="event-card">
              <img src={event.eventPicture} alt={event.eventName} className="event-image" />
              <div className="event-details">
                <div className="event-date">{event.eventDate}</div>
                <div className="event-name">{event.eventName}</div>
                <div className="event-location">{event.eventLocation}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default JoinEventPage2;
