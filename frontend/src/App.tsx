// frontend\src\App.tsx

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'; 

// Public Pages
import WelcomePage from './Page/WelcomePage/WelcomePage';
import WelcomeSubpage from './Page/WelcomeSubpage/WelcomeSubpage';
import SignUpPage from './Page/SignUpPage/SignUpPage'
import LoginPage from './Page/LoginPage/LoginPage'
import PasswordPage from './Page/PasswordPage/PasswordPage';
import ConfirmPassword from './Page/ConfirmPassword/ConfirmPassword';
import NotFoundPage from './Page/NotFoundPage/NotFoundPage';

// Private Pages
import MapScreen from './Page/MapScreen/MapScreen';
import HomePage from './Page/HomePage/HomePage';
import EventPage from './Page/EventPage/EventPage';
import JoinEventPage1 from './Page/JoinEventPage1/JoinEventPage1';
import JoinEventPage2 from './Page/JoinEventPage2/JoinEventPage2';
import JoinEventPage3 from './Page/JoinEventPage3/JoinEventPage3';
import CreateEventPage from './Page/CreateEventPage/CreateEventPage';
import WeatherPage from './Page/WeatherPage/WeatherPage';
import EmergencyScreen from './Page/EmergencyScreen/EmergencyScreen';
import SOSScreen from './Page/SOSScreen/SOSScreen';
import SettingScreen from './Page/SettingScreen/SettingScreen';
import SettingProfile from './Page/SettingProfile/SettingProfile';
import ProfilePage from './Page/ProfilePage/ProfilePage';

import { ErrorProvider } from './contexts/ErrorContext';
import ErrorPrompt from './Components/ErrorPrompt/ErrorPrompt';
import { AuthProvider } from './contexts/AuthContext'; // AuthContext provider
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'; // The PrivateRoute component
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <div className="app-container">
          <ErrorPrompt />
          <BrowserRouter>
            <AuthProvider> {/* Wrap all routes with AuthProvider */}
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<WelcomePage />}/>
                <Route path="/welcomesubpage" element={<WelcomeSubpage />}/>
                <Route path="/signuppage" element={<SignUpPage />}/>
                <Route path="/loginpage" element={<LoginPage />}/>
                <Route path="/passwordpage" element={<PasswordPage />}/>
                <Route path="/reset-password" element={<ConfirmPassword />} />
                <Route path="*" element={<NotFoundPage />} />  {/* Catch-all route for 404 */}
                
                {/* Private Routes */}
                <Route path="/mapscreen" element={<PrivateRoute><MapScreen /></PrivateRoute>}/>
                <Route path="/homepage" element={<PrivateRoute><HomePage /></PrivateRoute>}/>
                <Route path="/eventpage" element={<PrivateRoute><EventPage /></PrivateRoute>}/>
                <Route path="/joineventpage1" element={<PrivateRoute><JoinEventPage1 /></PrivateRoute>}/>
                <Route path="/joineventpage2" element={<PrivateRoute><JoinEventPage2 /></PrivateRoute>}/>
                <Route path="/joineventpage3/:id" element={<PrivateRoute><JoinEventPage3 /></PrivateRoute>} />
                <Route path="/createeventpage" element={<PrivateRoute><CreateEventPage /></PrivateRoute>}/>
                <Route path="/weatherpage" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
                <Route path="/emergencyscreen" element={<PrivateRoute><EmergencyScreen /></PrivateRoute>} />
                <Route path="/sosscreen" element={<PrivateRoute><SOSScreen /></PrivateRoute>} />
                <Route path="/settingscreen" element={<PrivateRoute><SettingScreen /></PrivateRoute>} />
                <Route path="/settingprofile" element={<PrivateRoute><SettingProfile /></PrivateRoute>} />
                <Route path="/profilepage" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
