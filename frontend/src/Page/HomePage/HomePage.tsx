// frontend/src/Page/HomePage/HomePage.tsx
import './HomePage.css';
import TopNavBar from "../../Components/TopNavBar/TopNavBar";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import homepage_1 from './homepage_1.png';
import homepage_2 from './homepage_2.png';
import homepage_3 from './homepage_3.png';

function HomePage() {
  return (
    <div className="homepage-container flex">
      <TopNavBar />
      <div className="main-content">
        <div className="content">
          <img src={homepage_2} alt="profilepic" className="profilepicture" />
          <div className="text-content">
            <div>Emma</div>
            <div>Date</div>
          </div>
          <button>Follow</button>
        </div>
        <img src={homepage_1} alt="event" className="event" />
      </div>
      <BottomNavBar />
    </div>
  );
}

export default HomePage;
