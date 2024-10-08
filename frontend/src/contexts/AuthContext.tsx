// frontend/src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios'; // Import axios here to set the default header

// Define the shape of the context
interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null; // The token is either a string or null
  setIsAuthenticated: (authState: boolean) => void; // Setter for authentication state
  setToken: (token: string | null) => void; // Setter for token
  logout: () => void; // A function to log the user out
}

// Provide a default value for the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const savedToken = localStorage.getItem('authToken'); // Get token from localStorage
      if (savedToken) {
        setToken(savedToken); // Set the token in state
        setIsAuthenticated(true); // Set the user as authenticated
        // Set the token in axios globally for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } else {
        setToken(null); // Clear token if not found
        setIsAuthenticated(false); // Set as not authenticated
        delete axios.defaults.headers.common['Authorization']; // Remove the Authorization header
      }
    };

    checkAuth(); // Check authentication when the component loads

    // Watch for changes to localStorage (e.g., login/logout from another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth); // Clean up the event listener
    };
  }, []);

  // Function to log the user out
  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setToken(null); // Clear token in state
    setIsAuthenticated(false); // Set as not authenticated
    delete axios.defaults.headers.common['Authorization']; // Remove the Authorization header
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, setIsAuthenticated, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;