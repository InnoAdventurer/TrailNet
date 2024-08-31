import './WelcomeSubpage.css';
import { Route, useNavigate } from 'react-router-dom';


function WelcomeSubpage(){
    const navigate = useNavigate()

    return (
        <div className="welcomesubpage-container flex">
            <p className="welcomesubpage-slogan">Buddy up for <br />&nbsp;&nbsp;&nbsp; your next ride</p>

            <div className="welcomesubpage-images">
                <img src="src/Page/WelcomeSubpage/welcomesubpage_1.png" alt="Cycling Buddy" className="welcomesubpage-image" />
                <img src="src/Page/WelcomeSubpage/welcomesubpage_2.png" alt="Cycling Buddy" className="welcomesubpage-image" />
            </div>

            <p className="welcomesubpage-slogan2">Find your cycling buddy</p>

            <div>..........</div>

            <button className="welcomesubpage-button" onClick={() => navigate("/loginpage")}>Log in</button>

            <button className="welcomesubpage-button2" onClick={() => navigate("/signuppage")}>Sign up</button>
        </div>
    );
}

export default WelcomeSubpage;