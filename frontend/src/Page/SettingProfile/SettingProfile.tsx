import './SettingProfile.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaPhoneAlt } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { RxActivityLog } from "react-icons/rx";
import { useState } from 'react';
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
  const [success, setSuccess] = useState<string>(''); // Handle success message

  // Function to submit the selected profile picture
  const handleSubmitProfilePicture = async () => {
    console.log(axios.defaults.headers.common['Authorization']); // Check if the token is set
    
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

      {success && <div className="success-message">{success}</div>}
      
      {/* Other settings */}
      <div className="setting">
        <CiEdit className="icon" />
        <div>Full Name</div>
      </div>
      <div className="setting">
        <TfiEmail className="icon" />
        <div>Email Address</div>
      </div>
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
    </div>
  );
}

export default SettingProfile;
