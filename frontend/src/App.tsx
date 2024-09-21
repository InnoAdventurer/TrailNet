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
import SettingScreen from './Page/SettingScreen/SettingScreen';
import SettingProfile from './Page/SettingProfile/SettingProfile';
import ConfirmPassword from './Page/ConfirmPassword/ConfirmPassword';
import ProfilePage from './Page/ProfilePage/ProfilePage';

function App() {
  return (
    <div className="app-container">
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
          <Route path="/settingscreen" element={<SettingScreen />} />
          <Route path="/settingprofile" element={<SettingProfile />} />
          <Route path="/confirmpassword" element={<ConfirmPassword />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />  {/* Catch-all route for 404 */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
