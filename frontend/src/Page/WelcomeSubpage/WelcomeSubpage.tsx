import './WelcomeSubpage.css';
import welcomesubpage_1 from './welcomesubpage_1.png'
import welcomesubpage_2 from './welcomesubpage_2.png'
import { Route, useNavigate } from 'react-router-dom';


function WelcomeSubpage(){
    const navigate = useNavigate()

    return (
        <div className="welcomesubpage-container flex">
            <p className="welcomesubpage-slogan">Buddy up for <br />&nbsp;&nbsp;&nbsp; your next ride</p>

            <div className="welcomesubpage-images">
                <img src={welcomesubpage_1} alt="Cycling Buddy" className="welcomesubpage-image" />
                <img src={welcomesubpage_2} alt="Cycling Buddy" className="welcomesubpage-image" />
            </div>

            <p className="welcomesubpage-slogan2">Find your cycling buddy</p>

            <div>..........</div>

            <button className="welcomesubpage-button" onClick={() => navigate("/loginpage")}>Log in</button>
            <br />
            <button className="welcomesubpage-button2" onClick={() => navigate("/signuppage")}>Sign up</button>
        </div>
    );
}

export default WelcomeSubpage;