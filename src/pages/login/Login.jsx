import { useEffect, useState } from "react";
import "./login.css";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import axios from 'axios'
import { Navigate,useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [user,setUser] = useState({
    email:'',
    password:''
  })
  const {user:loggedinUser} = useAuthContext();

  useEffect(()=>{
    if(loggedinUser){
      navigate('/')
    }
  },[loggedinUser])

  const {dispatch} = useAuthContext();

  function loginUser(){
    axios.post("https://social-api-server.vercel.app/api/auth/login",user).then(response => dispatch({type:"LOGIN",payload:response.data}),err=> console.log(err))
  }

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
            <input value={user.email} onChange={(e)=>setUser(prev => ({...prev,email:e.target.value}))} placeholder="Email" className="loginInput" />
            <input value={user.password} onChange={(e)=>setUser(prev => ({...prev,password:e.target.value}))} placeholder="Password" className="loginInput" />
            <button onClick={loginUser} className="loginButton">Log In</button>
            <span className="loginForgot">Forgot Password?</span>
            <button onClick={()=>{window.location.href='/register'}}  className="loginRegisterButton">
              Create a New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
