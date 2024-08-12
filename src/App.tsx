import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WelcomePage from './Page/WelcomePage/WelcomePage';
import WelcomeSubpage from './Page/WelcomeSubpage/WelcomeSubpage';
import SignUpPage from './Page/SignUpPage/SignUpPage'
import LoginPage from './Page/LoginPage/LoginPage'
import PasswordPage from './Page/PasswordPage/PasswordPage';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />}/>
          <Route path="/welcomesubpage" element={<WelcomeSubpage />}/>
          <Route path="/signuppage" element={<SignUpPage />}/>
          <Route path="/loginpage" element={<LoginPage />}/>
          <Route path="/passwordpage" element={<PasswordPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
