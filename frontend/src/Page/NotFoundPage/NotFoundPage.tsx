import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';  // Assuming you might want to style the 404 page separately

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button className="home-button" onClick={() => navigate('/')}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;