// frontend\src\Page\HomePage\HomePage.tsx

import './HomePage.css';
import { IoIosWarning } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import TopNavBar from "../../Components/TopNavBar/TopNavBar";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import homepage_1 from './homepage_1.png'
import homepage_2 from './homepage_2.png'
import homepage_3 from './homepage_3.png'

function HomePage() {
  return (
    <div className="homepage-container flex">
      <div className="header">
        <IoIosWarning className="icon"/>
        <IoSettingsOutline className="icon"/>
        <h2>Home</h2>
        <IoPersonAddOutline className="icon"/>
        <GoBell className="icon"/>
      </div>
      <div className="content">
        <img src={homepage_2} alt="profilepic" className="profilepicture" />
        <div>
          <div>Emma</div>
          <div>Date</div>
        </div>
        <button>Follow</button>
      </div>
      <img src={homepage_1} alt="profilepic" className="event" />
      <BottomNavBar />
    </div>
  );
}

export default HomePage;
