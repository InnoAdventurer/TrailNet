import './SettingScreen.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";




function SettingScreen() {

  return (
    <div className="settingscreen-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Setting</h2>
      </div>
        <button>
            <IoPersonOutline />
            <div className="text-container">
                <div className="subheader">Account</div>
                <div className="discription">Profile settings, security notifications</div>
            </div>
        </button>
        <button>
            <MdOutlinePrivacyTip />
            <div className="text-container">
                <div className="subheader">Privacy</div>
                <div className="discription">Block contacts, status, accessibility</div>
            </div>
        </button>
      <button>
        <IoIosNotificationsOutline />
        <div className="text-container">
            <div className="subheader">Notifications</div>
            <div className="discription">Message, conversional tones</div>
        </div>
      </button>
      <button>
        <IoPersonAddOutline />
        <div className="text-container">
            <div className="subheader">Invite friends</div>
            <div className="discription">Contact lists, Event</div>
        </div>
      </button>
      
      

      
    </div>
  );
}

export default SettingScreen;
