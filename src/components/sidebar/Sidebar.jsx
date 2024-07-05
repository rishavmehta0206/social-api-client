import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import { TiTick } from "react-icons/ti";
import { usePostContext } from "../../context/PostContext/PostProvider";

export default function Sidebar() {
  // const [users,setUsers] = useState([]);
  const { user: loggedInUser, users: allUsers, dispatch } = useAuthContext();
  const {userPost} = usePostContext();
  console.log("firstUser", loggedInUser,userPost,allUsers);
  const [file, setFile] = useState(null);

  // const handlePhotoUpload = async (e) => {
  //   const apiBody = {
  //     userId: loggedInUser?._id,
  //   };
  //   if (file) {
  //     const data = new FormData();
  //     const fileName = file.name;
  //     data.append("file", file);
  //     data.append("name", fileName);
  //     apiBody.profilePicture = fileName;
  //     try {
  //       await axios.post("http://localhost:8800/api/upload", data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   try {
  //     let { data } = await axios.put(
  //       `http://localhost:8800/api/user/${loggedInUser?._id}`,
  //       apiBody
  //     );
  //     dispatch({ type: "UPDATE_USER", payload: data });
  //   } catch (error) {}
  // };
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'imageuploadsocial'); // Replace with your Cloudinary upload preset

        const response = await axios.post('https://api.cloudinary.com/v1_1/dytiefj4e/image/upload', formData);
        uploadedImageUrl = response.data.secure_url; // Get the secure URL of the uploaded image from Cloudinary
      }

      const apiBody = {
        userId: loggedInUser._id,
        profilePicture: uploadedImageUrl // Attach the Cloudinary image URL to the API body
      };

      // const { data } = await axios.post('http://localhost:8800/api/post', apiBody);
      // dispatch({ type: 'ADD_POST', payload: data });

      // // Clear form fields after successful submission
      // setDescription('');
      // setFile(null);

            let { data } = await axios.put(
              `https://social-api-server.vercel.app/api/user/${loggedInUser?._id}`,
              apiBody
            );
            dispatch({ type: "UPDATE_USER", payload: data });
    }
     catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  // let endPoint = "http://localhost:8800/images/";

  let userImage =
    loggedInUser?.profilePicture?.length > 0
      ? loggedInUser?.profilePicture
      : "/assets/person/user.png";

  return (
    <div style={{
      paddingTop:'20px'
    }} className="sidebar">
      <div style={{
            boxShadow: '0px 0px 12px -5px rgba(0, 0, 0, 0.8)',
            padding:'10px'
      }} className="sidebarWrapper">
        <div className="profileInfo">
          <input
            type="file"
            style={{
              display: "none",
            }}
            id="fileInput"
            accept=".png,.jpeg,.jpg"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="fileInput">
            <img
              style={{
                cursor: "pointer",
              }}
              className="profileUserImg"
              src={loggedInUser?.profilePicture}
              alt=""
            />
          </label>
        </div>
        <h4
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="profileInfoName"
        >
          {file && (
            <TiTick
              onClick={submitHandler}
              style={{
                color: "blue",
                height: "30px",
                width: "30px",
                marginLeft: "30px",
                cursor: "pointer",
              }}
            />
          )}
        </h4>
        <div style={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center'
        }} className="">
          <span style={{
            fontWeight:'bolder',
            fontSize:'15px',
            marginBottom:'10px'
          }}>
          {loggedInUser?.username}
          </span>
          <span style={{
            fontWeight:'bolder',
            fontSize:'20px',
          }} className="profileInfoDesc">Hello my friends!</span>
          <BasicDetails
            followers={loggedInUser?.followers}
            followings={loggedInUser?.followings}
            posts = {userPost?.filter(post => post?.userId?._id === loggedInUser?._id).length}
          />
        </div>
      </div>

      {/* <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button> */}
      <hr className="sidebarHr" />
      <ul style={{
            boxShadow: '0px 0px 16px -8px rgba(0, 0, 0, 0.68)',
            padding:'10px'
      }} className="sidebarFriendList">
        <span
          style={{
            fontWeight: "bolder",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          Suggestions
        </span>
        {allUsers
          .filter((user) => user?._id != loggedInUser?._id)
          .map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
      </ul>
    </div>
  );
}

function BasicDetails({ followers, followings,posts }) {
  return <div style={{
    display:'flex',
    marginTop:'40px',
    justifyContent:'space-between',
    width:'100%'
  }} className="">
    <div style={{
      flex:'1',
      display:'flex',
      flexDirection:'column',
      alignItems:'center'
    }} className="">
      {followers.length}
      <span>Followers</span>
    </div>
    <div style={{
      flex:'1',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      borderLeft:'1px solid black'
    }} className="">
      {followings.length}
      <span>Followings</span>
    </div>
    <div style={{
      flex:'1',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      borderLeft:'1px solid black'
    }} className="">
      {posts}
      <span>Posts</span>
    </div>
  </div>
}
