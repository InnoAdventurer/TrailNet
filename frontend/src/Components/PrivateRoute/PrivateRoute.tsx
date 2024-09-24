// frontend/src/Components/PrivateRoute/PrivateRoute.tsx

import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import './PrivateRoute.css'; // Import the CSS for message styling

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  if (!authContext) {
    throw new Error('PrivateRoute must be used within an AuthProvider');
  }

  const { isAuthenticated } = authContext;

  useEffect(() => {
    if (!isAuthenticated) {
      // Show message and set delay before redirection
      setShowMessage(true);

      const timer = setTimeout(() => {
        setShouldRedirect(true); // Redirect after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isAuthenticated]);

  // If the user is not authenticated, show a message and redirect after delay
  if (!isAuthenticated && shouldRedirect) {
    return <Navigate to="/welcomesubpage" />;
  }

  return (
    <>
      {!isAuthenticated && showMessage && (
        <div className="redirect-message">
          <p>You are not authorized to access this page. Redirecting to the login page...</p>
        </div>
      )}
      {isAuthenticated && children} {/* Render the children only if authenticated */}
    </>
  );
};

export default PrivateRoute;