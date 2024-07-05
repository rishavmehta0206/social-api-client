import { useEffect, useState } from "react";
import "./closeFriend.css";
import { SlUserFollowing } from "react-icons/sl";
import { SlUserFollow } from "react-icons/sl";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";

export default function CloseFriend({ user }) {
  const [follow, setFollow] = useState(false);
  const { user: loggedInUser,dispatch,users } = useAuthContext();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log("follow", user,users);

  // useEffect(()=>{
  //   if(follow){
  //     axios.put(`https://social-api-server.vercel.app/api/user/${user?._id}/unfollow`,{
  //       "userId":Use?._id
  //   })
  //   }else{
  //     axios.put(`https://social-api-server.vercel.app/api/user/${user?._id}/follow`,{
  //       "userId":Use?._id
  //     })
  //   }
  // },[follow])
  let userImage =
  user?.profilePicture?.length > 0
    ? user?.profilePicture
    : "assets/person/user.png";

  function handleFollow() {
    axios.put(`https://social-api-server.vercel.app/api/user/${user?._id}/follow-unfollow`, {
      "userId":loggedInUser?._id
  }).then(res => {console.log('followReq',res.data);dispatch({type:"FOLLOW_UNFOLLOW",payload:res.data})});
    setFollow((prev) => !prev);
  }

  return (
    <li
      className="sidebarFriend"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className=""
      >
        <img
          className="sidebarFriendImg"
          // src={"http://localhost:3000/assets/" + user.profilePicture}
          src={userImage}
          alt=""
        />
        <span className="sidebarFriendName">{user.username}</span>
      </div>
      {users?.find(user => user?._id === loggedInUser?._id).followings.findIndex(use => use?._id === user?._id ) != -1 ? (
        <SlUserFollowing
          onClick={()=>handleFollow()}
          style={{
            color: "blue",
            cursor: "pointer",
            fontSize:'20px'
          }}
        />
      ) : (
        <SlUserFollow
          onClick={()=>handleFollow()}
          style={{
            color: "blue",
            cursor: "pointer",
            fontSize:"20px"
          }}
        />
      )}
    </li>
  );
}
