// frontend/src/Page/ProfilePage/ProfilePage.tsx

import { useState, useEffect } from 'react';
import './ProfilePage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import image404 from '../../assets/Picture/image404.webp'; // Placeholder image

// Import profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

const iconMap = {
  '/frontend/src/assets/Picture/Icon/icon_1.png': icon1,
  '/frontend/src/assets/Picture/Icon/icon_2.png': icon2,
  '/frontend/src/assets/Picture/Icon/icon_3.png': icon3,
  '/frontend/src/assets/Picture/Icon/icon_4.png': icon4,
  '/frontend/src/assets/Picture/Icon/icon_5.png': icon5,
  '/frontend/src/assets/Picture/Icon/icon_6.png': icon6,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [noPosts, setNoPosts] = useState<boolean>(false); // Track if no posts are available

  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.post(`/api/profile/fetch`, {});
        setUserData(userResponse.data);

        // Fetch user posts
        const postResponse = await axios.get(`/api/posts/user-posts`);
        setPosts(postResponse.data.posts);

        if (postResponse.data.posts.length === 0) {
          setNoPosts(true); // Set noPosts flag if no posts are available
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data or posts:', err);
        setError('Failed to load profile data or posts');
        setLoading(false);
      }
    };

    fetchUserDataAndPosts();
  }, []);

  const { username, friendsCount, profile_picture } = userData || {};
  const profilePic = profile_picture && iconMap[profile_picture as keyof typeof iconMap]
    ? iconMap[profile_picture as keyof typeof iconMap]
    : icon1;

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
          <img src={profilePic} alt="profilepic" className="profilepicture" />
          <div className="profile-details">
            {loading ? (
              <div>Loading profile...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                <div className="username">{username}</div>
                <div className="friends-count">Followers: {friendsCount}</div>
              </>
            )}
            <Link to="/postphotopage"><button>New Post</button></Link>
          </div>
        </div>

        <div className="post-section">
          {loading ? (
            <div>Loading posts...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : noPosts ? (
            <div className="no-posts-message">You have no posts yet. Start sharing something!</div>
          ) : (
            posts.map((post) => (
              <div className="post" key={post.post_id}>
                <div>{formatDate(post.created_at)}</div> {/* Format date */}
                {post.image_blob ? (
                  <img src={post.image_blob} alt="post" className="post-picture" />
                ) : (
                  <img src={image404} alt="post" className="post-picture" />
                )}
                <div className="caption">{post.content}</div>
                <div className="caption">Privacy: {post.privacy}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;