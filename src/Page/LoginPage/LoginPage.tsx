import './LoginPage.css';
import { Route, useNavigate } from 'react-router-dom';


function LoginPage(){
    const navigate = useNavigate()
    return (
      <div className="loginpage-container flex">
        <img src="src/Page/LoginPage/loginpage_1.png" alt="icon" className="icon" />

        <div className="table flex">
            <div className="table-title">Welcome back to TrailNet!</div>
            <div className="lable">
                Email
            </div>
            <div className="user-detail">
                <input type="text" value="" />
            </div>
            <div className="lable">
                Password
            </div>
            <div className="user-detail">
                <input type="text" value="" />
            </div>
            <button className="btn">Log in</button>
            <button className="forgot" onClick={() => navigate("/passwordpage")}>Forgot password</button>
        </div>
        <div>
            <div>------------------Or------------------</div>
            <div>Continue with Facebook</div>
        </div>

        
      </div>
    )
  }

export default LoginPage;