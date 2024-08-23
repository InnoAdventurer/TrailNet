// src/Components/BottomNavBar/BottomNavBar.tsx
import React from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { PiMapPinArea } from "react-icons/pi";
import { MdEventAvailable } from "react-icons/md";
import { IoPartlySunnyOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import './BottomNavBar.css';
import { Link } from 'react-router-dom';

const BottomNavBar: React.FC = () => {
  return (
    <div className="bottomNavBar">
      <Link to="/homepage"><div><IoHomeOutline />Home</div></Link>
      <div><PiMapPinArea />Map</div>
      <Link to="/eventpage"><div><MdEventAvailable />Event</div></Link>
      <div><IoPartlySunnyOutline />Weather</div>
      <div><CgProfile />Profile</div>
    </div>
  );
}

export default BottomNavBar;
