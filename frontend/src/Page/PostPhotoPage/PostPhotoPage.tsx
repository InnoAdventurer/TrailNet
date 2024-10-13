import React, { useState } from 'react';
import './PostPhotoPage.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

function PostPhotoPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
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

        <button className="submit-button">Post</button>
      </div>
    </div>
  );
}

export default PostPhotoPage;
