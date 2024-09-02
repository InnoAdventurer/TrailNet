import './JoinEventPage3.css';
import { useParams, Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import joineventpage2_1 from './joineventpage2_1.png';
import joineventpage2_2 from './joineventpage2_2.png';
import joineventpage2_3 from './joineventpage2_3.png';
import { FaRegCalendarCheck } from "react-icons/fa6";
import { PiMapPinArea } from "react-icons/pi";



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

function JoinEventPage3() {
  const { id } = useParams<{ id: string }>();
  const event = events.find(event => event.id === parseInt(id || '', 10));

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="joineventpage3-container">
      <div className="search-container">
        <div className="back">
          <Link to="/joineventpage2"><IoIosArrowBack /></Link>
        </div>
      </div>
      
      <div className="event-details-container">
        <img src={event.eventPicture} alt={event.eventName} className="event-detail-image" />
        <div className="event-detail-info">
          <h2 className="event-detail-name">{event.eventName}</h2>
          <p className="event-detail-date"><FaRegCalendarCheck /> {event.eventDate}</p>
          <p className="event-detail-location"><PiMapPinArea /> {event.eventLocation}</p>
          {/* You can add more details here */}
        </div>
      </div>
    </div>
  );
}

export default JoinEventPage3;
