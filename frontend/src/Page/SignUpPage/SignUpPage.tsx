import './SignUpPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signuppage_1 from './signuppage_1.png';

function SignUpPage() {
  // State to manage the input fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State to handle errors
  const [success, setSuccess] = useState(''); // State to handle success message

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Clear previous error
    setError('');
    setSuccess('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make a POST request to the backend to create a new account
      // const response = await axios.post('http://localhost:50000/api/auth/register', {
      const response = await axios.post('/backend_api/api/auth/register', {
        username,
        email,
        password,
      });

      // If signup is successful, navigate to the login page or show success message
      if (response.status === 201) {
        setSuccess('Account created successfully. Redirecting to login...');
        setTimeout(() => navigate('/loginpage'), 2000); // Redirect after 2 seconds
      }
    } catch (err: any) {
      // Handle errors (e.g., email already exists)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="signuppage-container flex">
      <img src={signuppage_1} alt="icon" className="icon" />

      <div className="table flex">
        <div className="table-title">Create an Account</div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
          
        <form onSubmit={handleSignUp}>
          <div className="label">Name</div>
          <div className="user-detail">
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} // Update state on input change
              required
            />
          </div>

          <div className="label">Email</div>
          <div className="user-detail">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
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
              required
            />
          </div>

          <button className="btn">Sign up</button>
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