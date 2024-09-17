// frontend/src/Page/EmergencyScreen/EmergencyScreen.tsx


import './EmergencyScreen.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { PiPhoneCallFill } from "react-icons/pi";
import { TbHeartHandshake } from "react-icons/tb";
import { MdSos } from "react-icons/md";
import { MdPhonelinkRing } from "react-icons/md";
import { useState, useEffect } from 'react';
import axios from 'axios';

function EmergencyScreen() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location', error);
        },
        { enableHighAccuracy: true }
      );

      // Clean up the watcher on component unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleCall000 = () => {
    window.location.href = 'tel:000';
  };

  const handleAskForHelp = async () => {
    try {
      const response = await axios.post('/backend_api/api/emergency/help', {
        location: { latitude, longitude },
        user_id: 1, // Replace with the current user's ID
      });
      if (response.status === 200) {
        alert('Help request sent to nearby users!');
      }
    } catch (error) {
      console.error('Error sending help request:', error);
    }
  };

  const handleSendSOS = async () => {
    try {
      const response = await axios.post('/backend_api/api/emergency/sos', {
        location: { latitude, longitude },
        user_id: 1, // Replace with the current user's ID
      });
      if (response.status === 200) {
        alert('SOS signal sent!');
      }
    } catch (error) {
      console.error('Error sending SOS signal:', error);
    }
  };

  const handleContactHelp = () => {
    const contactPhoneNumber = '1234567890'; // Replace with the actual contact number
    window.location.href = `tel:${contactPhoneNumber}`;
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(prevButton => (prevButton === button ? null : button));

    switch (button) {
      case '000':
        handleCall000();
        break;
      case 'help':
        handleAskForHelp();
        break;
      case 'sos':
        handleSendSOS();
        break;
      case 'contact':
        handleContactHelp();
        break;
      default:
        break;
    }
  };

  return (
    <div className="emergencyscreen-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Emergency</h2>
      </div>
      <button
        onClick={() => handleButtonClick('000')}
        className={activeButton === '000' ? 'active' : ''}
      >
        <PiPhoneCallFill /> Call 000
      </button>
      <button
        onClick={() => handleButtonClick('help')}
        className={activeButton === 'help' ? 'active' : ''}
        disabled={!latitude || !longitude}
      >
        <TbHeartHandshake /> Ask for Help From Nearby Users
      </button>
      <button
        onClick={() => handleButtonClick('sos')}
        className={activeButton === 'sos' ? 'active' : ''}
        disabled={!latitude || !longitude}
      >
        <MdSos /> Send an SOS Signal
      </button>
      <button
        onClick={() => handleButtonClick('contact')}
        className={activeButton === 'contact' ? 'active' : ''}
      >
        <MdPhonelinkRing /> Seek help from a contact
      </button>
    </div>
  );
}

export default EmergencyScreen;