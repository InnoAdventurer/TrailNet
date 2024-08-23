import './SignUpPage.css';
import { useState } from 'react';

function SignUpPage() {
  // State to manage the input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="signuppage-container flex">
      <img src="src/Page/SignUpPage/signuppage_1.png" alt="icon" className="icon" />

      <div className="table flex">
        <div className="table-title">Create an Account</div>

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

        <div className="label">
          Password
        </div>
        <div className="user-detail">
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
            placeholder="Password must contain at least 8 characters" // Use placeholder for hint
            className="password-hint"
          />
        </div>

        <div className="label">
          Confirm Password
        </div>
        <div className="user-detail">
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} // Update state on input change
          />
        </div>

        <button className="btn">Sign up</button>
      </div>
      
      <div>
        <div>------------------Or------------------</div>
        <div>Continue with Facebook</div>
      </div>
    </div>
  );
}

export default SignUpPage;