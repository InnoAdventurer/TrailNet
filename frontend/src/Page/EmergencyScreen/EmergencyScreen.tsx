import './EmergencyScreen.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { PiPhoneCallFill } from "react-icons/pi";
import { TbHeartHandshake } from "react-icons/tb";
import { MdSos } from "react-icons/md";
import { MdPhonelinkRing } from "react-icons/md";
import { useState } from 'react';

function EmergencyScreen() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (button: string) => {
    // Toggle the active state
    setActiveButton(prevButton => (prevButton === button ? null : button));
  };

  return (
    <div className="emergencyscreen-container flex">
      <div className="header-container">
        <div className="back">
          <Link to="/homepage"><IoIosArrowBack /></Link>
        </div>
        <h2>Emergency</h2>
      </div>
      <button
        onClick={() => handleButtonClick('000')}
        className={activeButton === '000' ? 'active' : ''}
      >
        <PiPhoneCallFill /> Call 000
      </button>
      <button
        onClick={() => handleButtonClick('help')}
        className={activeButton === 'help' ? 'active' : ''}
      >
        <TbHeartHandshake /> Ask for Help From Nearby Users
      </button>
      <button
        onClick={() => handleButtonClick('sos')}
        className={activeButton === 'sos' ? 'active' : ''}
      >
        <MdSos /> Send an SOS Signal
      </button>
      <button
        onClick={() => handleButtonClick('contact')}
        className={activeButton === 'contact' ? 'active' : ''}
      >
        <MdPhonelinkRing /> Seek help from a contact
      </button>
    </div>
  );
}

export default EmergencyScreen;
