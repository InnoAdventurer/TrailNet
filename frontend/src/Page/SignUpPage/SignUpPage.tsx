// frontend\src\Page\SignUpPage\SignUpPage.tsx

import './SignUpPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signuppage_1 from './signuppage_1.png';

// Import profile icons
import icon1 from '../../assets/Picture/Icon/icon_1.png';
import icon2 from '../../assets/Picture/Icon/icon_2.png';
import icon3 from '../../assets/Picture/Icon/icon_3.png';
import icon4 from '../../assets/Picture/Icon/icon_4.png';
import icon5 from '../../assets/Picture/Icon/icon_5.png';
import icon6 from '../../assets/Picture/Icon/icon_6.png';

const apiUrl = process.env.VITE_BACKEND_URL

function SignUpPage() {
  // State to manage the input fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(icon1); // State to manage profile icon
  const [error, setError] = useState(''); // State to handle errors
  const [success, setSuccess] = useState(''); // State to handle success message
  const [loading, setLoading] = useState(false); // State to handle loading message

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Clear previous error and success messages
    setError('');
    setSuccess('');
    setLoading(true); // Set loading state to true

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false); // Reset loading state
      return;
    }

    try {
      // Make a POST request to the backend to create a new account
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        email,
        password,
        profile_picture: selectedIcon, // Send the selected icon
      });

      // If signup is successful, navigate to the login page or show success message
      if (response.status === 201) {
        setSuccess('Account created successfully. Redirecting to login...');
        setTimeout(() => navigate('/loginpage'), 2000); // Redirect after 2 seconds
      }
    } catch (err: any) {
      // Handle errors (e.g., email already exists)
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="signuppage-container flex">
      <img src={signuppage_1} alt="icon" className="icon" />

      <div className="table flex">
        <div className="table-title">Create an Account</div>

        {loading && <div className="loading-message">Loading...</div>} {/* Display loading message */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
          
        <form onSubmit={handleSignUp}>
          <div className="label">Name</div>
          <div className="user-detail">
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} // Update state on input change
              placeholder="Enter your name" // Placeholder for name field
              required
            />
          </div>

          <div className="label">Email</div>
          <div className="user-detail">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
              placeholder="Enter your email" // Placeholder for email field
              required
            />
          </div>

          <div className="label">Password</div>
          <div className="user-detail">
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
              placeholder="Password must contain at least 8 characters" // Use placeholder for hint
              className="password-hint"
              required
            />
          </div>

          <div className="label">Confirm Password</div>
          <div className="user-detail">
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} // Update state on input change
              placeholder="Re-enter your password" // Placeholder for confirm password field
              required
            />
          </div>

          {/* Profile Icon Selection */}
          <div className="label">Choose a Profile Picture</div>
          <div className="icon-grid">
            {[icon1, icon2, icon3, icon4, icon5, icon6].map((icon, index) => (
              <img 
                key={index} 
                src={icon} 
                alt={`icon_${index + 1}`} 
                className={`profile-icon ${selectedIcon === icon ? 'selected' : ''}`} 
                onClick={() => setSelectedIcon(icon)} // Handle icon selection on click
              />
            ))}
          </div>

          <button className="btn" disabled={loading}>Sign up</button> {/* Disable button while loading */}
        </form>
      </div>
      
      <div>
        <div>------------------Or------------------</div>
        <div>Continue with Facebook</div>
      </div>
    </div>
  );
}

export default SignUpPage;