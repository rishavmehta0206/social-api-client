import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import {Link} from 'react-router-dom'
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import { CiLogout } from "react-icons/ci";
import { useState } from "react";
import { useModalClose } from "../../hooks/useModalClose";
export default function Topbar() {
  const [toggle,setToggle] = useState(false)
  const {modal, elementRef,setModal} = useModalClose();

  const {user:loggedInUser,dispatch} = useAuthContext();


  let endPoint = "https://social-api-server.vercel.app/images/";

  // let userImage =
  // loggedInUser?.profilePicture?.length > 0
  //   ? loggedInUser?.profilePicture
  //   : "assets/person/user.png";

  return (
    <div style={{
      zIndex:'999'
    }} className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{
          textDecoration:'none'
        }} className="logo">Social</Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div ref={elementRef} style={{
        position:'relative'
      }} className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <img onClick={()=>setModal(prev => !prev)} src={loggedInUser?.profilePicture} alt="" className="topbarImg"/>
        {modal && <div onClick={()=>{
            dispatch({type:'LOGOUT'})
          }}  style={{
          position:'absolute',
          top:'40px',
          borderRadius:'5px',
          right:'80px',
          backgroundColor:'white',
          color:'black',
          padding:'20px',
          width:'fit-content',
          display:'flex',
          alignItems:'center',
          gap:'10px',
          cursor:'pointer'
        }} className="">
          <CiLogout  style={{
            fontWeight:'bolder',
            fontSize:'20px',
          }}/> Logout
        </div>}
      </div>
    </div>
  );
}

