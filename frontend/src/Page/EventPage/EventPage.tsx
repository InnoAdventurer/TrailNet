// frontend/src/Page/EventPage/EventPage.tsx

import './EventPage.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { MdPersonSearch } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import eventpage_1 from './eventpage_1.png';
import eventpage_2 from './eventpage_2.png';
import eventpage_3 from './eventpage_3.png';
import { Link } from 'react-router-dom';

const events = [
  {
    id: 1,
    eventName: '10KM NIGHT RUN',
    eventDate: 'Sat, 20 Aug 6:00PM',
    eventLocation: 'Wollongong Beach',
    eventPicture: eventpage_1, // Use imported image
  },
  {
    id: 2,
    eventName: '20KM CYCLING',
    eventDate: 'Fri, 16 Sep 2:00PM',
    eventLocation: 'Stanwell Park',
    eventPicture: eventpage_2, // Use imported image
  },
  {
    id: 3,
    eventName: '15KM RUNNING',
    eventDate: 'Mon, 2 Oct 3:00PM',
    eventLocation: 'Stuart Park',
    eventPicture: eventpage_3, // Use imported image
  },
];

function EventPage() {
  return (
    <div className="eventpage-container flex">
      <div className="main-content">
        <div className="search-container">
          <Link to="/homepage"><div className="back"><IoIosArrowBack /></div></Link>
          <input type="text" placeholder="Search" className="search" />
          <FiSearch className="search-icon" />
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
          <Link to="/joineventpage2"><div className="events-container">
            {events.map(event => (
              <div className="event-card" key={event.id}>
                <img src={event.eventPicture} alt={event.eventName} className="eventpic" />
                <div>{event.eventName}</div>
              </div>
            ))}
          </div></Link>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}

export default EventPage;
