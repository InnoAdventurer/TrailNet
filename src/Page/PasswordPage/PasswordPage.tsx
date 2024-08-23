import './PasswordPage.css';
import { useState } from 'react';

function PasswordPage() {
  const [email, setEmail] = useState(''); // State to manage email input

  return (
    <div className="passwordpage-container flex">
      <div className="table flex">
        <div className="table-title">Forgot your password?</div>
        <div className="message">Enter your email to get help logging in.</div>
        <div className="label">
          Email
        </div>
        <div className="user-detail">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
          />
        </div>
        <button className="btn">Send email</button>
      </div>
    </div>
  );
}

export default PasswordPage;