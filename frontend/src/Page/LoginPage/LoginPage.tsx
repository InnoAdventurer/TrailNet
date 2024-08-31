import './LoginPage.css';
import { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import logo from '../../assets/Picture/Logo.jpeg'

function LoginPage(){
    const navigate = useNavigate();

    // State for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for handling errors
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from submitting the traditional way

        try {
            // Make a POST request to the backend server
            const response = await axios.post('http://localhost:50000/api/auth/login', {
            // const response = await axios.post('/backend_api/api/auth/login', {
                email,
                password,
            });

            // If login is successful, store the token and redirect
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token); // Store the token in local storage
                navigate('/homepage'); // Redirect to homepage after successful login
            }
        } catch (err) {
            // Handle errors (e.g., invalid credentials)
            setError('Invalid email or password');
        }
    };

    return (
      <div className="loginpage-container flex">
        <img src={logo} alt="icon" className="icon" />

        <div className="table flex">
            <div className="table-title">Welcome back to TrailNet!</div>
            {error && <div className="error-message">{error}</div>} {/* Display error message if there's an error */}
            <form onSubmit={handleLogin}>
                <div className="lable">Email</div>
                <div className="user-detail">
                    <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                    />
                </div>
                <div className="lable">Password</div>
                <div className="user-detail">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                    />
                </div>
                <button className="btn">Log in</button>
            </form>
            <br />
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