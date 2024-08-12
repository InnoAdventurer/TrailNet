import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WelcomePage from './Page/WelcomePage/WelcomePage';
import WelcomeSubpage from './Page/WelcomeSubpage/WelcomeSubpage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />}/>
          <Route path="/WelcomeSubpage" element={<WelcomeSubpage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
