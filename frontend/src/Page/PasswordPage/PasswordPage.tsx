import './PasswordPage.css';
import { useState } from 'react';
import axios from 'axios';

function PasswordPage() {
  const [email, setEmail] = useState(''); // State to manage email input
  const [message, setMessage] = useState(''); // State to manage success/error messages
  const [error, setError] = useState(''); // State to manage error messages
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Send a POST request to the backend to initiate the password reset
      const response = await axios.post('/backend_api/api/auth/forgot-password', { email });

      // If successful, show a success message
      if (response.status === 200) {
        setMessage('Password reset email sent successfully. Please check your inbox.');
      }
    } catch (err: any) {
      // Handle errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordpage-container flex">
      <div className="table flex">
        <div className="table-title">Forgot your password?</div>
        <div className="message">Enter your email to get help logging in.</div>

        {message && <div className="success-message">{message}</div>} {/* Display success message */}
        {error && <div className="error-message">{error}</div>} {/* Display error message */}

        <form onSubmit={handlePasswordReset}>
          <div className="label">Email</div>
          <div className="user-detail">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
              placeholder="Enter your email"
              required
            />
          </div>
          <button className="btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordPage;