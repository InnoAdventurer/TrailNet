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
import './App.css'; 
import JoinEventPage1 from './Page/JoinEventPage1/JoinEventPage1';






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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
