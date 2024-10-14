// frontend/src/Page/PostPhotoPage/PostPhotoPage.tsx

import React, { useState } from 'react';
import './PostPhotoPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

function PostPhotoPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('all_users'); // Default privacy setting
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(''); // For managing success messages
  const navigate = useNavigate(); // For navigation after successful post

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  const handlePrivacyChange = (privacyOption: string) => {
    setPrivacy(privacyOption);
  };

  const handleSubmit = async () => {
    if (!photo) {
      setError('Please upload a photo to make a post.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', photo);
      formData.append('content', caption);
      formData.append('privacy', privacy); // Add the selected privacy

      const response = await axios.post(`/api/posts/create`, formData);

      if (response.status === 201) {
        setSuccess('Post Created Successfully! Redirecting...');

        setTimeout(() => {
          // Post was successfully created, navigate back to profile
          navigate(`/profilepage`);
        }, 3000); // 3-second delay before redirect
      } else {
        setError('Failed to create the post. Please try again.');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('An error occurred while creating the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postphotopage-container">
      <div className="header">
        <Link to="/profilepage" className="back">
          <IoIosArrowBack />
        </Link>
        <h2>Make a post</h2>
      </div>

      <div className="content">
        <div className="photo-upload">
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {photo && (
            <div className="photo-preview">
              <img src={URL.createObjectURL(photo)} alt="Preview" />
            </div>
          )}
        </div>

        <div className="caption-input">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={handleCaptionChange}
          />
        </div>

        <div className="privacy-selection">
          <label>Who can see this post?</label>
          <div className="privacy-options">
            <button
              type="button"
              className={`privacy-button ${privacy === 'all_users' ? 'selected' : ''}`}
              onClick={() => handlePrivacyChange('all_users')}
            >
              All Users
            </button>
            <button
              type="button"
              className={`privacy-button ${privacy === 'followers' ? 'selected' : ''}`}
              onClick={() => handlePrivacyChange('followers')}
            >
              Only Followers
            </button>
            <button
              type="button"
              className={`privacy-button ${privacy === 'only_me' ? 'selected' : ''}`}
              onClick={() => handlePrivacyChange('only_me')}
            >
              Only Me
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}

export default PostPhotoPage;