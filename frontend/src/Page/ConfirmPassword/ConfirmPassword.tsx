import './ConfirmPassword.css';


function ConfirmPassword() {
  return (
    <div className="confirmpassword-container flex">
      <div className="table flex">
        <div className="table-title">Confirm Your Password</div>
        <div>
            Input new password
        </div>
        <input>
        </input>
        <div>
            Confirm password
        </div>
        <input>
        </input>
        <button>Submit</button>

        
      </div>
    </div>
  );
}

export default ConfirmPassword;