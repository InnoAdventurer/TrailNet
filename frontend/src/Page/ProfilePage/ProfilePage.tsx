// frontend/src/Page/ProfilePage/ProfilePage.tsx

import { useState, useEffect } from 'react';
import './ProfilePage.css';
import { IoIosArrowBack } from "react-icons/io";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; 
import { Link } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import image404 from '../../assets/Picture/image404.webp'; // Placeholder image
import TopNavBar from "../../Components/TopNavBar/TopNavBar";

// Import profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

const iconMap: { [key: string]: string } = {
  'icon_1': icon1,
  'icon_2': icon2,
  'icon_3': icon3,
  'icon_4': icon4,
  'icon_5': icon5,
  'icon_6': icon6,
};

interface Post {
  post_id: number;
  created_at: string;
  content: string;
  privacy: string;
  image_blob: string;
  liked: boolean;
  likeCount: number;
}

interface UserData {
  username: string;
  friendsCount: number;
  profile_picture: string;
}

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

  const fetchUserData = async () => {
    try {
      const userResponse = await axios.post(`/api/profile/fetch`, {});
      setUserData(userResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const postResponse = await axios.get(`/api/posts/user-posts`);
      setPosts(postResponse.data.posts);

      if (postResponse.data.posts.length === 0) {
        setNoPosts(true); // Set noPosts flag if no posts are available
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  const toggleLike = async (post_id: number, liked: boolean) => {
    try {
      const endpoint = liked ? '/api/posts/unlike' : '/api/posts/like';
      await axios.post(endpoint, { post_id });
      fetchPosts(); // Refresh posts to update like status and count
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, []);

  const getProfilePicture = (picturePath: string): string => {
    const matches = picturePath.match(/icon_\d+/);
    return matches && iconMap[matches[0]] ? iconMap[matches[0]] : icon1;
  };

  const { username, friendsCount, profile_picture } = userData || {};
  const profilePic = getProfilePicture(profile_picture || '');

  return (
    <div className="profilepage-container flex">
      <TopNavBar />
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
                <div className="caption">
                  {post.liked ? (
                    <AiFillHeart onClick={() => toggleLike(post.post_id, true)} />
                  ) : (
                    <AiOutlineHeart onClick={() => toggleLike(post.post_id, false)} />
                  )}
                  <span>{post.likeCount} Likes</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}

export default ProfilePage;