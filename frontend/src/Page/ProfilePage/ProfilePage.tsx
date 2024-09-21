// frontend/src/Page/ProfilePage/ProfilePage.tsx

import './ProfilePage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import profilepage_1 from './profilepage_1.png';
import homepage_1 from './homepage_1.png';

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
          <img src={profilepage_1} alt="profilepic" className="profilepicture" />
          <div className="profile-details">
            <div className="username">John</div>
            <div className="friends-count">Friends: 50</div>
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
