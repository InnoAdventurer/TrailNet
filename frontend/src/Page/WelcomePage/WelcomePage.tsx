import './WelcomePage.css';
import { Route, useNavigate } from 'react-router-dom';

function WelcomePage(){
    const navigate = useNavigate()

    return <div><div className="welcomepage-container flex">
        <p className="welcomepage-title">Ride Together
        <br />&nbsp;&nbsp;&nbsp; Climb Higher</p>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <button className="welcomepage-button" onClick={() => navigate("/welcomesubpage")}>
            Get Started!
        </button>
    </div>
    </div>;
}

export default WelcomePage;