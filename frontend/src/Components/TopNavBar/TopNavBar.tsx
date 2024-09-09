// frontend/src/Components/TopNavBar/TopNavBar.tsx
import './TopNavBar.css';
import { IoIosWarning } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { Link } from 'react-router-dom';

function TopNavBar() {
  return (
    <div className="topnavbar-container">
      <Link to="/emergencyscreen"><IoIosWarning className="icon"/></Link>
      <Link to="/settingscreen"><IoSettingsOutline className="icon"/></Link>
      <h2>Home</h2>
      <IoPersonAddOutline className="icon"/>
      <GoBell className="icon"/>
    </div>
  );
}

export default TopNavBar;
