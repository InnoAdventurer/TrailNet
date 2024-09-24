// frontend/src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the context
interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (authState: boolean) => void; // Export the setter function
}

// Provide a default value for the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token); // Set isAuthenticated based on token presence
    };

    checkAuth(); // Check authentication on component load

    // Optionally, watch for changes to localStorage (e.g., login/logout from another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth); // Clean up the event listener
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;