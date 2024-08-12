import './PasswordPage.css';

function PasswordPage(){
    return (
      <div className="passwordpage-container flex">
        <div className="table flex">
            <div className="table-title">Forgot your password?</div>
            <div className="message">Enter your email to get help logging in.</div>
            <div className="lable">
                Email
            </div>
            <div className="user-detail">
                <input type="text" value="" />
            </div>
            <button className="btn">Send email</button>
        </div>
        
      </div>
    )
  }

export default PasswordPage;