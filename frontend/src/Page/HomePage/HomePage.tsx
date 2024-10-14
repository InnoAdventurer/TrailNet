// frontend/src/Page/HomePage/HomePage.tsx

import { useEffect, useState } from 'react';
import './HomePage.css';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Heart icons for like/unlike
import TopNavBar from "../../Components/TopNavBar/TopNavBar";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
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

function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomePagePosts = async () => {
    try {
      const response = await axios.get(`/api/posts/home-posts`);
      setPosts(response.data.posts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching home page posts:', err);
      setError('Failed to load home page posts');
      setLoading(false);
    }
  };

  const toggleLike = async (post_id: number, liked: boolean) => {
    try {
      const endpoint = liked ? '/api/posts/unlike' : '/api/posts/like';
      await axios.post(endpoint, { post_id });
      fetchHomePagePosts(); // Refresh posts to update like status and count
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    fetchHomePagePosts();
  }, []);

  const handleFollow = async (postOwnerId: number, isFollowing: boolean) => {
    console.log(`Following ID: ${postOwnerId}, Is Following: ${isFollowing}`); // Debug log

    // Optimistically update the state before the API call
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_owner_id === postOwnerId ? { ...post, isFollowing: !isFollowing } : post
      )
    );

    try {
      const endpoint = isFollowing ? '/api/friends/unfollow' : '/api/friends/follow';
      const response = await axios.post(`${endpoint}`, { followingId: postOwnerId });
    } catch (error) {
      console.error('Error updating follow state:', error);

      // Roll back the optimistic update if the API call fails
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_owner_id === postOwnerId ? { ...post, isFollowing: isFollowing } : post
        )
      );
    }
  };

  return (
    <div className="homepage-container flex">
      <TopNavBar />

      <div className="main-content">
        {loading ? (
          <div>Loading posts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          posts.map((post) => {
            const isFollowing = post.isFollowing;
            const profilePic =
              post.profile_picture && iconMap[post.profile_picture as keyof typeof iconMap]
                ? iconMap[post.profile_picture as keyof typeof iconMap]
                : icon1;

            return (
              <div className="content" key={post.post_id}>
                <div className="profile-section">
                  <img src={profilePic} alt="profilepic" className="profilepicture" />
                  <div className="text-content">
                    <div>{post.username}</div>
                    <div>{formatDate(post.created_at)}</div> {/* Format date */}
                  </div>
                  {post.post_owner_id !== post.current_user_id && (
                    <button
                      onClick={() => handleFollow(post.post_owner_id, isFollowing)} // Use post_owner_id here
                      className={`follow-button ${isFollowing ? 'following' : ''}`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
                <img src={post.image_blob || image404} alt="post" className="event-picture" />
                <div className="caption">{post.content}</div>
                <div className="caption">Privacy: {post.privacy}</div>
                <div className="caption">
                  {post.liked ? (
                    <AiFillHeart onClick={() => toggleLike(post.post_id, true)} />
                  ) : (
                    <AiOutlineHeart onClick={() => toggleLike(post.post_id, false)} />
                  )}
                  <span>{post.likeCount} Likes</span>
                </div>
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