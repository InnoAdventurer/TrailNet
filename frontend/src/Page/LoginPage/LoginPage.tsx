// frontend\src\Page\LoginPage\LoginPage.tsx

import './LoginPage.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import logo from '../../assets/Picture/Logo.jpeg';
import AuthContext from '../../contexts/AuthContext';

const apiUrl = process.env.VITE_BACKEND_URL;

function LoginPage() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext); 

        if (!authContext) {
            return <p>Authentication not available. Please refresh the page.</p>;
        }
      
        const { setIsAuthenticated } = authContext; // Safely destructure it

    // State for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for handling errors
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State for handling loading state

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from submitting the traditional way

        setError(''); // Clear previous errors
        setLoading(true); // Set loading state to true

        try {
            // Make a POST request to the backend server
            const response = await axios.post(`${apiUrl}/api/auth/login`, {
                email,
                password,
            });

            // If login is successful, store the token and update context state
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token); // Store the token in local storage
                setIsAuthenticated(true); // Update authentication state in context
                navigate('/homepage'); // Redirect to homepage after successful login
            } else {
                setError('Unexpected error occurred.');
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError('Invalid credentials');
            } else {
                setError('Server error. Please try again later.');
            }
        } finally {
            setLoading(false); // Reset loading state after request completes
        }
    };

    return (
        <div className="loginpage-container flex">
            <img src={logo} alt="icon" className="icon" />

            <div className="table flex">
                <div className="table-title">Welcome back to TrailNet!</div>
                {loading && <div className="loading-message">Loading...</div>} {/* Display loading message */}
                {error && <div className="error-message">{error}</div>} {/* Display error message if there's an error */}
                <form onSubmit={handleLogin}>
                    <div className="lable">Email</div>
                    <div className="user-detail">
                        <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                        placeholder="Enter your email" // Placeholder for email field
                        required
                        />
                    </div>
                    <div className="lable">Password</div>
                    <div className="user-detail">
                        <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                        placeholder="Enter your password" // Placeholder for password field
                        required
                        />
                    </div>
                    <button className="btn" disabled={loading}>Log in</button> {/* Disable button while loading */}
                </form>
                <button className="forgot" onClick={() => navigate("/passwordpage")}>Forgot password</button>
            </div>
        </div>
    );
}

export default LoginPage;