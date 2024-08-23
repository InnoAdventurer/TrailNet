import './HomePage.css';
import { IoIosWarning } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { PiMapPinArea } from "react-icons/pi";
import { MdEventAvailable } from "react-icons/md";
import { IoPartlySunnyOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="header">
        <IoIosWarning className="icon" />
        <IoSettingsOutline className="icon" />
        <h2>Home</h2>
        <IoPersonAddOutline className="icon" />
        <GoBell className="icon" />
      </div>

      <div className="main-content">
        <div className="content">
          <img
            src="src/Page/HomePage/homepage_2.png"
            alt="profilepic"
            className="profilepicture"
          />
          <div className="text-content">
            <div>Emma</div>
            <div>Date</div>
          </div>
          <button>Follow</button>
        </div>
        <img
          src="src/Page/HomePage/homepage_1.png"
          alt="profilepic"
          className="event"
        />
        
      </div>

      <div className="bottomNavBar">
        <div>
          <IoHomeOutline />
          Home
        </div>
        <div>
          <PiMapPinArea />
          Map
        </div>
        <div>
          <MdEventAvailable />
          Event
        </div>
        <div>
          <IoPartlySunnyOutline />
          Weather
        </div>
        <div>
          <CgProfile />
          Profile
        </div>
      </div>
    </div>
  );
}

export default HomePage;
