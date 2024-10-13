// frontend/src/Components/TopNavBar/TopNavBar.tsx

import React, { useState } from 'react';
import './TopNavBar.css';
import { IoIosWarning, IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { Link, useNavigate } from 'react-router-dom';

function TopNavBar() {
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const navigate = useNavigate(); // For navigation after successful logout

  const handleLogout = () => {
    // Clear auth token and display a logout message
    localStorage.removeItem('authToken');
    setShowLogoutMessage(true);

    // Wait for 3 seconds before redirecting to welcome page
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="topnavbar-container">
      <Link to="/emergencyscreen"><IoIosWarning className="icon"/></Link>
      <Link to="/settingscreen"><IoSettingsOutline className="icon"/></Link>
      <h2>Home</h2>
      <GoBell className="icon"/>
      <IoIosLogOut className="icon" onClick={handleLogout} />

      {showLogoutMessage && (
        <div className="logout-message">You have been logged out. Redirecting...</div>
      )}
    </div>
  );
}

export default TopNavBar;