// frontend\src\Components\TopNavBar\TopNavBar.tsx

import './TopNavBar.css';
import { IoIosWarning } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";

function TopNavBar(){
    return (
      <header className="homepage-container flex">
        <div className="header">
            <IoIosWarning className="icon"/>
            <IoSettingsOutline className="icon"/>
            <h2>Home</h2>
            <IoPersonAddOutline className="icon"/>
            <GoBell className="icon"/>
        </div>
    </header>
)
}

export default TopNavBar;