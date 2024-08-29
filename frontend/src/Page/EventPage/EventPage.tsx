import './EventPage.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { MdPersonSearch } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import BottomNavBar from '../../Components/BottomNavBar/BottomNavBar';
import React from 'react';


function EventPage(){
    return (
      <div className="eventpage-container flex">
        <div className="search-container">
            <div className="back"><IoIosArrowBack /></div>
            <input type="text" placeholder="Search" className="search" />
            <FiSearch className="search-icon" />
        </div>
        <div className="join">
            <div>
                <p>Discover Events to<br /> meet new people!</p>
                <button>Join Events</button>
            </div>
            <MdPersonSearch className="person-search" />
        </div>
        <div className="create">
            <IoCreateOutline className="create-event"/>
            <div>
                <p>Create Events to<br />invite your friends!</p>
                <button>Create Events</button>
            </div>
        </div>
        <p>Browse events</p>
        <div className="browse">
            <div>
                <img
                src="src/Page/EventPage/eventpage_2.png"
                alt="event1"
                className="eventpic"
                />
                <div>Event 1</div>
            </div>
            <div>
                <img
                src="src/Page/EventPage/eventpage_2.png"
                alt="event2"
                className="eventpic"
                />
                <div>Event 2</div>
            </div>
            <div>
                <img
                src="src/Page/EventPage/eventpage_2.png"
                alt="event3"
                className="eventpic"
                />
                <div>Event 3</div>
            </div>
        </div>
        <BottomNavBar />
      </div>
    )
}

export default EventPage;
