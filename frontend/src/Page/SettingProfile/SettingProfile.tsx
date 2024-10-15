// frontend\src\Page\SettingProfile\SettingProfile.tsx

import './SettingProfile.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { useState, useEffect } from 'react';
import { PiPasswordFill } from "react-icons/pi";
import { SlUserFollowing } from "react-icons/sl";
import { MdFollowTheSigns, MdContactEmergency } from "react-icons/md";

import axios from '../../utils/axiosInstance';

// Import the profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

interface User {
  user_id: number;
  username: string;
}

function SettingProfile() {
  const [selectedIcon, setSelectedIcon] = useState<string>(''); // State for the selected profile icon
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
  const [isFullNameModalOpen, setIsFullNameModalOpen] = useState<boolean>(false); // State to control full name modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false); // State to control email modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState<boolean>(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>(''); // Handle success message
  const [loading, setLoading] = useState<boolean>(true); // Loading state for initial data fetch
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch user data from the backend (full name, email, profile picture)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('/api/profile/fetch');
        const {
          username,
          email,
          profile_picture,
          emergency_contact_name,
          emergency_contact_number,
        } = response.data;
  
        // Set the fetched values into state
        setFullName(username);
        setEmail(email);
        setSelectedIcon(profile_picture);
        setEmergencyContactName(emergency_contact_name || '');
        setEmergencyContactNumber(emergency_contact_number || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []); 
  
  // Function to submit the selected profile picture
  const handleSubmitProfilePicture = async () => {
    try {
      const response = await axios.post(`/api/profile/update-picture`, {
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
      const response = await axios.post(`/api/profile/update-fullname`, {
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
      const response = await axios.post(`/api/profile/update-email`, {
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

  // Function to handle password update
  const handleSubmitPassword = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`/api/profile/update-password`, {
        password,
      });

      if (response.status === 200) {
        alert('Password updated successfully');
        setIsPasswordModalOpen(false);

        // Clear the password fields after submission
        setPassword('');
        setConfirmPassword('');
        setPasswordError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get<User[]>(`/api/profile/followers`);
      setFollowers(response.data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axios.get<User[]>(`/api/profile/following`);
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, []);

  const handleEmergencyContactSubmit = async () => {
    try {
      const response = await axios.post('/api/profile/update-emergency-contact', {
        emergency_contact_name: emergencyContactName,
        emergency_contact_number: emergencyContactNumber,
      });

      if (response.status === 200) {
        alert('Emergency contact updated successfully');
        setIsEmergencyModalOpen(false); // Close modal on success
      }
    } catch (error) {
      console.error('Error updating emergency contact:', error);
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
      
      {/* Password Display */}
      <div className="setting" onClick={() => setIsPasswordModalOpen(true)}> {/* Opens password modal on click */}
        <PiPasswordFill className="icon" />
        <div>Password</div>
      </div>

      {/* Modal for password update */}
      {isPasswordModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="modal-input"
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <button className="btn" onClick={handleSubmitPassword}>Submit</button>
            <button className="btn" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Emergency Contact Display */}
      <div className="setting" onClick={() => setIsEmergencyModalOpen(true)}>
        <MdContactEmergency className="icon" />
        <div>Emergency Contact</div>
      </div>

      {/* Modal for Emergency Contact */}
      {isEmergencyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Set Emergency Contact</h3>
            <input
              type="text"
              placeholder="Emergency Contact Name"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Emergency Contact Number"
              value={emergencyContactNumber}
              onChange={(e) => setEmergencyContactNumber(e.target.value)}
              className="modal-input"
            />
            <button className="btn" onClick={handleEmergencyContactSubmit}>Submit</button>
            <button className="btn" onClick={() => setIsEmergencyModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Follower Display */}
      <div className="setting" onClick={() => setIsFollowerModalOpen(true)}> {/* Opens follower modal on click */}
        <SlUserFollowing className="icon" />
        <div>Follower Network</div>
      </div>

      {/* Modal for showing followers */}
      {isFollowerModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Your Followers</h3>
            <ul>
              {followers.map((follower) => (
                <li key={follower.user_id}>{follower.username}</li>
              ))}
            </ul>
            <button className="btn" onClick={() => setIsFollowerModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Following Display */}
      <div className="setting" onClick={() => setIsFollowingModalOpen(true)}> {/* Opens following modal on click */}
        <MdFollowTheSigns className="icon" />
        <div>Following Network</div>
      </div>
      
      {/* Modal for showing followings */}
      {isFollowingModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Your Following</h3>
            <ul>
              {following.map((followed) => (
                <li key={followed.user_id}>{followed.username}</li>
              ))}
            </ul>
            <button className="btn" onClick={() => setIsFollowingModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      
      {success && <div className="success-message">{success}</div>}

    </div>
  );
}

export default SettingProfile;