import './MapScreen.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

function MapScreen() {
    return (
      <div className="mapscreen-container flex">
        <div className="header">
          <div className="back"><IoIosArrowBack /></div>
          <h2>Map</h2>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search" className="search" />
          <FiSearch className="search-icon" />
        </div>
        <div className="map">
            Map API
        </div>
        <div className="table flex">
            <div><b>Activity:</b> Hiking</div>
            <div><b>Distance:</b> 25km</div>
            <div><b>Event:</b> Birthday Hiking Camp</div>
        </div>
        <div>Weather API</div>
      </div>
    );
}

export default MapScreen;
