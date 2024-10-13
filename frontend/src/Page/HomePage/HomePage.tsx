// frontend/src/Page/HomePage/HomePage.tsx

import { useEffect, useState } from 'react';
import './HomePage.css';
import TopNavBar from "../../Components/TopNavBar/TopNavBar";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import axios from 'axios';
import image404 from '../../assets/Picture/image404.webp'; // Placeholder image

// Import profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

const apiUrl = process.env.VITE_BACKEND_URL;

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

function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomePagePosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get(`${apiUrl}/api/posts/home-posts`, config);
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching home page posts:', err);
        setError('Failed to load home page posts');
        setLoading(false);
      }
    };

    fetchHomePagePosts();
  }, []);

  return (
    <div className="homepage-container flex">
      <TopNavBar />

      <div className="main-content">
        {loading ? (
          <div>Loading posts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          posts.map((post, index) => {
            const profilePic = post.profile_picture && iconMap[post.profile_picture as keyof typeof iconMap]
              ? iconMap[post.profile_picture as keyof typeof iconMap]
              : icon1;

            return (
              <div className="content" key={post.post_id}>
                <div className="profile-section">
                  <img
                    src={profilePic}
                    alt="profilepic"
                    className="profilepicture"
                  />
                  <div className="text-content">
                    <div>{post.username}</div>
                    <div>{formatDate(post.created_at)}</div> {/* Format date */}
                  </div>
                  <button>Follow</button>
                </div>
                <img
                  src={post.image_blob || image404}
                  alt="post"
                  className="event-picture"
                />
                <div className="caption">{post.content}</div>
                <div className="caption">Privacy: {post.privacy}</div>
              </div>
            );
          })
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}

export default HomePage;
