// frontend/src/Page/ProfilePage/ProfilePage.tsx

import { useState, useEffect } from 'react';
import './ProfilePage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from 'axios'; // To fetch user data
import homepage_1 from './homepage_1.png';

// Import all profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

const apiUrl = process.env.VITE_BACKEND_URL; // Make sure to set this in your environment

const iconMap = {
  '/frontend/src/assets/Picture/Icon/icon_1.png': icon1,
  '/frontend/src/assets/Picture/Icon/icon_2.png': icon2,
  '/frontend/src/assets/Picture/Icon/icon_3.png': icon3,
  '/frontend/src/assets/Picture/Icon/icon_4.png': icon4,
  '/frontend/src/assets/Picture/Icon/icon_5.png': icon5,
  '/frontend/src/assets/Picture/Icon/icon_6.png': icon6,
};

const posts = [
  {
    postDate: "Sep 20, 2024",
    postPic: homepage_1,
    caption: "Cycling at Bulli to Wollongong Beach"
  },
  {
    postDate: "Sep 20, 2024",
    postPic: homepage_1,
    caption: "Cycling at Bulli to Wollongong Beach"
  },
];

function ProfilePage() {
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [error, setError] = useState<string | null>(null); // To handle any errors

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/profile/fetch`);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Extract user data
  const { username, friendsCount, profile_picture } = userData || {};
  const profilePic = profile_picture && iconMap.hasOwnProperty(profile_picture) 
    ? iconMap[profile_picture as keyof typeof iconMap] 
    : icon1; // Default to icon1 if not found

  return (
    <div className="profilepage-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Profile</h2>
      </div>

      <div className="main-content">
        <div className="profile-section">
          <img src={profilePic} alt="profilepic" className="profilepicture" /> {/* Dynamic profile picture */}
          <div className="profile-details">
            {loading ? (
              <div>Loading profile...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                <div className="username">{username}</div> {/* Dynamic username */}
                <div className="friends-count">Friends: {friendsCount}</div> {/* Dynamic friends count */}
              </>
            )}
            <Link to="/postphotopage"><button>New Post</button></Link>
          </div>
        </div>

        <div className="post-section">
          {posts.map((post, index) => (
            <div className="post" key={index}>
              <img src={post.postPic} alt="post" className="post-picture" />
              <div className="caption">{post.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;