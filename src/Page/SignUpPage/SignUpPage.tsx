import './SignUpPage.css';

function SignUpPage(){
    return (
      <div className="signuppage-container flex">
        <img src="src/Page/SignUpPage/signuppage_1.png" alt="icon" className="icon" />

        <div className="table flex">
            <div className="table-title">Create an Account</div>
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
                <input type="text" value="Password must contain at least 8 characters" className="password-hint" />
            </div>
            <div className="lable">
                Confirm Password
            </div>
            <div className="user-detail">
                <input type="text" value="" />
            </div>
            <button className="btn">Sign up</button>
        </div>
        <div>
            <div>------------------Or------------------</div>
            <div>Continue with Facebook</div>
        </div>

        
      </div>
    )
  }

export default SignUpPage;