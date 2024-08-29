// src/Page/HomePage/HomePage.tsx
import './HomePage.css';
import { IoIosWarning } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import TopNavBar from "../../Components/TopNavBar/TopNavBar";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import React from 'react';

function HomePage() {
  return (
    <div className="homepage-container flex">
      <div className="header">
        <IoIosWarning className="icon"/>
        <IoSettingsOutline className="icon"/>
        <h2>Home</h2>
        <IoPersonAddOutline className="icon"/>
        <GoBell className="icon"/>
      </div>
      <div className="content">
        <img src="src/Page/HomePage/homepage_2.png" alt="profilepic" className="profilepicture" />
        <div>
          <div>Emma</div>
          <div>Date</div>
        </div>
        <button>Follow</button>
      </div>
      <img src="src/Page/HomePage/homepage_1.png" alt="profilepic" className="event" />
      <BottomNavBar />
    </div>
  );
}

export default HomePage;
