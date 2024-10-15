// frontend/src/Page/EmergencyScreen/EmergencyScreen.tsx

import './EmergencyScreen.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { PiPhoneCallFill } from "react-icons/pi";
import { TbHeartHandshake } from "react-icons/tb";
import { MdSos, MdPhonelinkRing } from "react-icons/md";
import React, { useState, useEffect, useContext } from 'react';
import axios from '../../utils/axiosInstance';
import { ErrorContext } from '../../contexts/ErrorContext'; // Import ErrorContext

function EmergencyScreen() {
  const { setError } = useContext(ErrorContext); // Use the setError function from context
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [contactNumber, setContactNumber] = useState<string | null>(null); // Store fetched contact number
  const [contactName, setContactName] = useState<string | null>(null); // Store fetched contact name
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location', error);
          setError('Error getting location. Please check your GPS settings.');
        },
        { enableHighAccuracy: true }
      );

      // Clean up the watcher on component unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    // Fetch emergency contact details on mount
    const fetchEmergencyContact = async () => {
      try {
        const response = await axios.post('/api/profile/fetch');
        const { emergency_contact_name, emergency_contact_number } = response.data;
        setContactName(emergency_contact_name);
        setContactNumber(emergency_contact_number);
      } catch (error) {
        console.error('Error fetching emergency contact:', error);
        setError('Failed to fetch emergency contact. Please try again.');
      }
    };

    fetchEmergencyContact();
  }, [setError]);

  const handleCall000 = () => {
    const confirmed = window.confirm('You are about to call 000. Proceed?');
    if (confirmed) {
      window.location.href = 'tel:000';
    }
  };

  const handleAskForHelp = async () => {
    try {
      const response = await axios.post(`/api/emergency/help`, {
        location: { latitude, longitude },
      });
      if (response.status === 200) {
        alert('Help request sent to all users!');
      }
    } catch (error) {
      console.error('Error sending help request:', error);
      setError('Error sending help request. Please try again.');
    }
  };

  const handleSendSOS = () => {
    navigate('/sosscreen'); // Navigate to the SOS screen
  };

  const handleContactHelp = () => {
    if (!contactNumber) {
      const confirmed = window.confirm(
        'No emergency contact is set. Would you like to call 000 instead?'
      );
      if (confirmed) {
        window.location.href = 'tel:000';
      }
      return;
    }
  
    const confirmed = window.confirm(
      `You are about to call your emergency contact: ${contactName}. Proceed?`
    );
    if (confirmed) {
      window.location.href = `tel:${contactNumber}`;
    }
  };

  const handleButtonClick = (button: string) => {
    setActiveButton((prevButton) => (prevButton === button ? null : button));

    switch (button) {
      case '000':
        handleCall000();
        break;
      case 'help':
        if (latitude && longitude) {
          handleAskForHelp();
        } else {
          setError('Location is not available. Please check your GPS settings.');
        }
        break;
      case 'sos':
        handleSendSOS(); // Navigate to SOS screen
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
          <Link to="/homepage">
            <IoIosArrowBack />
          </Link>
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