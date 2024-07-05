import { useEffect, useState } from "react";
import "./register.css";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";

export default function Register() {
  const [register,setRegister] = useState({});
  const {user:loggedinUser} = useAuthContext();

  const registerUser = () => {
    console.log(register)
    axios.post("https://social-api-server.vercel.app/api/auth/register",register).then(res => window.location.href="/login").catch(err => console.log(err))
  }

  useEffect(()=>{
    if(loggedinUser){
      window.location.href = '/'
    }
  },[loggedinUser])
  console.log(register)
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input onChange={(e)=>setRegister(prev => ({...prev,username:e.target.value}))} placeholder="Username" className="loginInput" />
            <input onChange={(e)=>setRegister(prev => ({...prev,email:e.target.value}))} placeholder="Email" className="loginInput" />
            <input onChange={(e)=>setRegister(prev => ({...prev,password:e.target.value}))} placeholder="Password" className="loginInput" />
            <input onChange={(e)=>setRegister(prev => ({...prev,confirmPassword:e.target.value}))} placeholder="Password Again" className="loginInput" />
            <button onClick={registerUser} className="loginButton">Sign Up</button>
            <button onClick={()=>{window.location.href='/login'}} className="loginRegisterButton">
              Log into Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
