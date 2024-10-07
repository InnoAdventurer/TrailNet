import './SettingProfile.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaPhoneAlt } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { RxActivityLog } from "react-icons/rx";
import { useState } from 'react';

function SettingProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Function to handle file input change
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Convert image to base64 and set it
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid .jpeg or .jpg file");
    }
  };

  return (
    <div className="settingprofile-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/settingscreen"><IoIosArrowBack /></Link>
        </div>
        <h2>Profile Setting</h2>
      </div>
      
      {/* Profile Picture Upload */}
      <div className="setting" onClick={() => document.getElementById('profile-upload')?.click()}>
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-picture" />
        ) : (
          <CgProfile className="icon" />
        )}
        <div>Profile Picture</div>
        <input
          id="profile-upload"
          type="file"
          accept=".jpeg,.jpg"
          style={{ display: 'none' }} // Hide the actual file input
          onChange={handleProfilePictureUpload}
        />
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
