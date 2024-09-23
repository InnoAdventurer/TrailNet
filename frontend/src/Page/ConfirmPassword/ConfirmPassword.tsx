// frontend/src/Page/ConfirmPassword/ConfirmPassword.tsx

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ConfirmPassword.css';

function ConfirmPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token and email from the URL query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing token.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      setError('Invalid or missing token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/reset-password`, {
        token,
        email,
        newPassword,
      });

      setSuccess('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="confirmpassword-container flex">
      <div className="table flex">
        <div className="table-title">Reset Your Password</div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ConfirmPassword;
