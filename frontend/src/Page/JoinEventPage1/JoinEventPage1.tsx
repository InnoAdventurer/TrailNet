// frontend/src/Page/JoinEventPage1/JoinEventPage1.tsx

import './JoinEventPage1.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import joineventpage1_1 from './joineventpage1_1.png';
import joineventpage1_2 from './joineventpage1_2.png';
import joineventpage1_3 from './joineventpage1_3.png';

function JoinEventPage1() {
  const [activityType, setActivityType] = useState("Cycling");
  const [dateRange, setDateRange] = useState("Today");
  const navigate = useNavigate();

  // Function to navigate to JoinEventPage2 with GPS coordinates (Wollongong's coordinates)
  const handleWollongongSearch = () => {
    const wollongongLat = -34.4278;
    const wollongongLon = 150.8931;
    navigate(`/joineventpage2?latitude=${wollongongLat}&longitude=${wollongongLon}`);
  };

  // Function to navigate to JoinEventPage2 with selected activity type
  const handleActivityTypeSearch = () => {
    navigate(`/joineventpage2?activityType=${activityType}`);
  };

  // Function to navigate to JoinEventPage2 with selected date range
  const handleDateRangeSearch = () => {
    navigate(`/joineventpage2?dateRange=${dateRange}`);
  };

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

      {/* Section for events near Wollongong */}
      <div className="discover-section" >
        <div className="discover-title">Discover event near Wollongong</div>
        <img src={joineventpage1_1} alt="nearby" className="nearby" onClick={handleWollongongSearch}/>
      </div>

      {/* Section for events filtered by activity type */}
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
        <img src={joineventpage1_2} alt="activity" className="nearby" onClick={handleActivityTypeSearch}/>
      </div>

      {/* Section for events filtered by date */}
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
        <img src={joineventpage1_3} alt="date" className="nearby" onClick={handleDateRangeSearch} />
      </div>
    </div>
  );
}

export default JoinEventPage1;