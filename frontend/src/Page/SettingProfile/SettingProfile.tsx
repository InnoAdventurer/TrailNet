// frontend\src\Page\SettingProfile\SettingProfile.tsx

import './SettingProfile.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaPhoneAlt } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { RxActivityLog } from "react-icons/rx";
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import the profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

const apiUrl = process.env.VITE_BACKEND_URL;

function SettingProfile() {
  const [selectedIcon, setSelectedIcon] = useState<string>(''); // State for the selected profile icon
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
  const [isFullNameModalOpen, setIsFullNameModalOpen] = useState<boolean>(false); // State to control full name modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false); // State to control email modal
  const [fullName, setFullName] = useState<string>(''); // State for full name input
  const [email, setEmail] = useState<string>(''); // State for email input
  const [success, setSuccess] = useState<string>(''); // Handle success message
  const [loading, setLoading] = useState<boolean>(true); // Loading state for initial data fetch
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch user data from the backend (full name, email, profile picture)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/profile/fetch`);
        const { username, email, profile_picture } = response.data;

        // Set the fetched values into state
        setFullName(username);
        setEmail(email);
        setSelectedIcon(profile_picture);

        setLoading(false); // Stop loading when data is fetched
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);  // Function to submit the selected profile picture

  const handleSubmitProfilePicture = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/profile/update-picture`, {
        profile_picture: selectedIcon, // Send selected icon to backend
      });

      if (response.status === 200) {
        setSuccess('Profile picture updated successfully');
        setIsModalOpen(false); // Close modal after successful submission
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  // Function to submit the updated full name
  const handleSubmitFullName = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/profile/update-fullname`, {
        full_name: fullName, // Send full name to backend
      });

      if (response.status === 200) {
        setSuccess('Full Name updated successfully');
        setIsFullNameModalOpen(false); // Close modal after successful submission
      }
    } catch (error) {
      console.error('Error updating Full Name:', error);
    }
  };

  // Function to submit the updated email
  const handleSubmitEmail = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/profile/update-email`, {
        email: email, // Send email to backend
      });

      if (response.status === 200) {
        setSuccess('Email updated successfully');
        setIsEmailModalOpen(false); // Close modal after successful submission
      }
    } catch (error) {
      console.error('Error updating Email:', error);
    }
  };

  return (
    <div className="settingprofile-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/settingscreen"><IoIosArrowBack /></Link>
        </div>
        <h2>Profile Setting</h2>
      </div>

      {/* Profile Picture Display */}
      <div className="setting" onClick={() => setIsModalOpen(true)}> {/* Opens modal on click */}
        <CgProfile className="icon" />
        <div>Profile Picture</div>
      </div>

      {/* Modal for profile picture selection */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select a Profile Picture</h3>
            <div className="icon-grid">
              {[icon1, icon2, icon3, icon4, icon5, icon6].map((icon, index) => (
                <img
                  key={index}
                  src={icon}
                  alt={`icon_${index + 1}`}
                  className={`profile-icon ${selectedIcon === icon ? 'selected' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                />
              ))}
            </div>
            <button className="btn" onClick={handleSubmitProfilePicture}>
              OK
            </button>
            <button className="btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Full Name Display */}
      <div className="setting" onClick={() => setIsFullNameModalOpen(true)}> {/* Opens full name modal on click */}
        <CiEdit className="icon" />
        <div>Full Name</div>
      </div>

      {/* Modal for full name update */}
      {isFullNameModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Full Name</h3>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="modal-input"
            />
            <button className="btn" onClick={handleSubmitFullName}>
              OK
            </button>
            <button className="btn" onClick={() => setIsFullNameModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Email Display */}
      <div className="setting" onClick={() => setIsEmailModalOpen(true)}> {/* Opens email modal on click */}
        <TfiEmail className="icon" />
        <div>Email Address</div>
      </div>

      {/* Modal for email update */}
      {isEmailModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="modal-input"
            />
            <button className="btn" onClick={handleSubmitEmail}>
              OK
            </button>
            <button className="btn" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Other settings */}
      <div className="setting">
        <FaPhoneAlt className="icon" />
        <div>Contact Number</div>
      </div>
      <div className="setting">
        <GoPeople className="icon" />
        <div>Friend Network</div>
      </div>
      <div className="setting">
        <RxActivityLog className="icon" />
        <div>Activities</div>
      </div>

      {success && <div className="success-message">{success}</div>}

    </div>
  );
}

export default SettingProfile;