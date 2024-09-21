import './SettingProfile.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaPhoneAlt } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { RxActivityLog } from "react-icons/rx";

function SettingProfile() {

  return (
    <div className="settingprofile-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/settingscreen"><IoIosArrowBack /></Link>
        </div>
        <h2>Profile Setting</h2>
      </div>
        <div className="setting">
            <CgProfile className="icon" />
            <div>Profile Picture</div>
        </div>
        <div className="setting">
            <CiEdit className="icon" />
            <div>Full Name</div>
        </div>
        <div className="setting">
            <TfiEmail className="icon" />
            <div>Email Address</div>
        </div>
        <div className="setting">
            <FaPhoneAlt className="icon" />
            <div>Contact Number</div>
        </div>
        <div className="setting">
            <GoPeople className="icon" />
            <div>Friend Network</div>
        </div>
        <div className="setting">
            <RxActivityLog className="icon" />
            <div>Activities</div>
        </div>
    </div>
  );
}

export default SettingProfile;
