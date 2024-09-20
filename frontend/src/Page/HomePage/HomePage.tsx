import './HomePage.css';
import TopNavBar from "../../Components/TopNavBar/TopNavBar";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import homepage_1 from './homepage_1.png';
import homepage_2 from './homepage_2.png';
import homepage_3 from './homepage_3.png';

// Array of posts with imported images
const posts = [
  {
    profilePic: homepage_2,
    accountName: "Emma",
    postDate: "Sep 20, 2024",
    postPic: homepage_1,
    caption: "Cycling at Bulli to Wollongong Beach"
  },
  {
    profilePic: homepage_2,
    accountName: "Emma",
    postDate: "Sep 20, 2024",
    postPic: homepage_1,
    caption: "Cycling at Bulli to Wollongong Beach"
  },
];

function HomePage() {
  return (
    <div className="homepage-container flex">
      <TopNavBar />
      
      <div className="main-content">
        {posts.map((post, index) => (
          <div className="content" key={index}>
            <div className="profile-section">
              <img src={post.profilePic} alt="profilepic" className="profilepicture" />
              <div className="text-content">
                <div>{post.accountName}</div>
                <div>{post.postDate}</div>
              </div>
              <button>Follow</button>
            </div>
            <img src={post.postPic} alt="post" className="event-picture" />
            <div className="caption">{post.caption}</div>
          </div>
        ))}
      </div>

      <BottomNavBar />
    </div>
  );
}

export default HomePage;
