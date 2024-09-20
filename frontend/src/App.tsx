// frontend\src\App.tsx

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WelcomePage from './Page/WelcomePage/WelcomePage';
import WelcomeSubpage from './Page/WelcomeSubpage/WelcomeSubpage';
import SignUpPage from './Page/SignUpPage/SignUpPage'
import LoginPage from './Page/LoginPage/LoginPage'
import PasswordPage from './Page/PasswordPage/PasswordPage';
import MapScreen from './Page/MapScreen/MapScreen';
import HomePage from './Page/HomePage/HomePage';
import EventPage from './Page/EventPage/EventPage';
import JoinEventPage1 from './Page/JoinEventPage1/JoinEventPage1';
import JoinEventPage2 from './Page/JoinEventPage2/JoinEventPage2';
import NotFoundPage from './Page/NotFoundPage/NotFoundPage';
import JoinEventPage3 from './Page/JoinEventPage3/JoinEventPage3';
import './App.css'; 
import CreateEventPage from './Page/CreateEventPage/CreateEventPage';
import WeatherPage from './Page/WeatherPage/WeatherPage';
import EmergencyScreen from './Page/EmergencyScreen/EmergencyScreen';
import SOSScreen from './Page/SOSScreen/SOSScreen';
import SettingScreen from './Page/SettingScreen/SettingScreen';

import { ErrorProvider } from './contexts/ErrorContext';
import ErrorPrompt from './components/ErrorPrompt/ErrorPrompt';

function App() {
  return (
    <ErrorProvider>
      <div className="app-container">
        <ErrorPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path="/welcomesubpage" element={<WelcomeSubpage />}/>
            <Route path="/signuppage" element={<SignUpPage />}/>
            <Route path="/loginpage" element={<LoginPage />}/>
            <Route path="/passwordpage" element={<PasswordPage />}/>
            <Route path="/mapscreen" element={<MapScreen />}/>
            <Route path="/homepage" element={<HomePage />}/>
            <Route path="/eventpage" element={<EventPage />}/>
            <Route path="/joineventpage1" element={<JoinEventPage1 />}/>
            <Route path="/joineventpage2" element={<JoinEventPage2 />}/>
            <Route path="/joineventpage3/:id" element={<JoinEventPage3 />} />
            <Route path="/createeventpage" element={<CreateEventPage />}/>
            <Route path="/weatherpage" element={<WeatherPage />} />
            <Route path="/emergencyscreen" element={<EmergencyScreen />} />
            <Route path="/sosscreen" element={<SOSScreen />} />
            <Route path="/settingscreen" element={<SettingScreen />} />
            <Route path="*" element={<NotFoundPage />} />  {/* Catch-all route for 404 */}
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorProvider>
  );
}

export default App;
