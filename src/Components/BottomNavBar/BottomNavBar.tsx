// src/Components/BottomNavBar/BottomNavBar.tsx
import React from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { PiMapPinArea } from "react-icons/pi";
import { MdEventAvailable } from "react-icons/md";
import { IoPartlySunnyOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import './BottomNavBar.css';

const BottomNavBar: React.FC = () => {
  return (
    <div className="bottomNavBar">
      <div><IoHomeOutline />Home</div>
      <div><PiMapPinArea />Map</div>
      <div><MdEventAvailable />Event</div>
      <div><IoPartlySunnyOutline />Weather</div>
      <div><CgProfile />Profile</div>
    </div>
  );
}

export default BottomNavBar;
