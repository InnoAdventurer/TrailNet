import './ConfirmPassword.css';


function ConfirmPassword() {
  return (
    <div className="confirmpassword-container flex">
      <div className="table flex">
        <div className="table-title">Reset Your Password</div>
        <div>
            Input your new password
        </div>
        <input>
        </input>
        <div>
            Input your new password
        </div>
        <input>
        </input>
        <button>Submit</button>

        
      </div>
    </div>
  );
}

export default ConfirmPassword;