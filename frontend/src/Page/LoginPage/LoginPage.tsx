import React from 'react';
import './LoginPage.css';
import { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';


function LoginPage(){
    const navigate = useNavigate();

    // State for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="loginpage-container flex">
        <img src="src/Page/LoginPage/loginpage_1.png" alt="icon" className="icon" />

        <div className="table flex">
            <div className="table-title">Welcome back to TrailNet!</div>
            <div className="lable">
                Email
            </div>
            <div className="user-detail">
                <input 
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} // Update state on input change
                />
            </div>
            <div className="lable">
                Password
            </div>
            <div className="user-detail">
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} // Update state on input change
                />
            </div>
            <button className="btn">Log in</button>
            <button className="forgot" onClick={() => navigate("/passwordpage")}>Forgot password</button>
        </div>
        <div>
            <div>------------------Or------------------</div>
            <div>Continue with Facebook</div>
        </div>

        
      </div>
    )
  }

export default LoginPage;