// frontend/src/Page/JoinEventPage1/JoinEventPage1.tsx

import './JoinEventPage1.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import joineventpage1_1 from './joineventpage1_1.png';
import joineventpage1_3 from './joineventpage1_3.png';

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

function JoinEventPage1() {
  const [activityType, setActivityType] = useState("Cycling");
  const [dateRange, setDateRange] = useState("Today");
  const navigate = useNavigate();

  // Function to navigate to JoinEventPage2 with GPS coordinates (Wollongong's coordinates)
  const handleWollongongSearch = () => {
    // TODO: Currently only hard coding to show event near Wollongong
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

  // Function to randomly select an image based on the event type
  const getRandomActivityImage = () => {
    let images: string[] = [];
    switch (activityType) {
      case 'Cycling':
        images = [Cycling_1, Cycling_2, Cycling_3, Cycling_4];
        break;
      case 'Hiking':
        images = [Hiking_1, Hiking_2, Hiking_3, Hiking_4];
        break;
      case 'Jogging':
        images = [Jogging_1, Jogging_2, Jogging_3, Jogging_4];
        break;
      default:
        images = [Cycling_1]; // Fallback in case of unexpected type
        break;
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
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
        <img src={getRandomActivityImage()} alt="activity" className="nearby" onClick={handleActivityTypeSearch}/>
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