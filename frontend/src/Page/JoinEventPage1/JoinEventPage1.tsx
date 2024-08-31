import './JoinEventPage1.css';
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import joineventpage1_1 from './joineventpage1_1.png';
import joineventpage1_2 from './joineventpage1_2.png';
import joineventpage1_3 from './joineventpage1_3.png';


function JoinEventPage1(){
    return (
      <div className="eventpage-container flex">
        <div className="search-container">
            <div className="back"><Link to="/eventpage"><IoIosArrowBack /></Link></div>
            <input type="text" placeholder="Search" className="search" />
            <FiSearch className="search-icon" />
        </div>
        <div>
            <div>Discover event near Wollongong</div>
            <img src={joineventpage1_1} alt="nearby" className="nearby" />
        </div>
        <div>
            <div>Discover event by activity &nbsp;
                <select>
                    <option value="Cycling">Cycling</option>
                    <option value="Jogging">Jogging</option>
                    <option value="Hiking">Hiking</option>
                </select>
            </div>
            <img src={joineventpage1_2} alt="nearby" className="nearby" />
        </div>
        <div>
            <div>Discover event by date &nbsp;
                <select>
                    <option value="Today">Today</option>
                    <option value="Next7days">Next 7 days</option>
                    <option value="Over7days">Over 7 days</option>
                </select>
                </div>
            <img src={joineventpage1_3} alt="nearby" className="nearby" />
        </div>
      </div>
    )
}

export default JoinEventPage1;
