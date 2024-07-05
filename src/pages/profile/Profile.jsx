import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import Modal from '../../components/modal/Modal'

export default function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const { username } = useParams();
  const {user:loggedInUser,dispatch} = useAuthContext();

  useEffect(() => {
    axios
      .get(`https://social-api-server.vercel.app/api/user?username=${username}`)
      .then((res) => setUser(res.data));
  }, []);

  const handlePhotoUpload = async (e) => {
    const apiBody = {
      userId: loggedInUser?._id,
    };
    if(file){
      const data = new FormData();
      const fileName = file.name;
      data.append("file",file);
      data.append("name",fileName)
      apiBody.profilePicture = fileName;
      try {
        await axios.post("https://social-api-server.vercel.app/api/upload",data)
      } catch (error) {
        console.log(error)
      }
    }
    try {
      let {data} = await axios.put(`https://social-api-server.vercel.app/api/user/${loggedInUser?._id}`, apiBody);
      dispatch({type:"UPDATE_USER",payload:data})
    } catch (error) {}
  };
  let endPoint = "https://social-api-server.vercel.app/images/"
  let userImage =  loggedInUser?.profilePicture?.length > 0 ? endPoint +  loggedInUser?.profilePicture : endPoint + "noAvatar.png"

  console.log(user);
  return (
    <>
    <Modal/>
      <Topbar />
      <div style={{
      maxWidth:'1680px',
      margin:'0px auto'
    }} className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                // src="https://social-api-server.vercel.app/images/noCover.png"
                src="/assets/person/noCover.png"
                alt=""
              />
              {/* <div className="">
                <input
                  type="file"
                  style={{
                    display:'none'
                  }}
                  id="fileInput"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="fileInput">
                  <img
                  style={{
                    cursor:'pointer'
                  }}
                    className="profileUserImg"
                    src={userImage}
                    alt=""
                  />
                  
                </label>
              </div> */}
            </div>
            {/* <div className="profileInfo">
              <h4 style={{
                display:'flex',
                alignItems:'center'
              }} className="profileInfoName">{loggedInUser?.username}{file && <TiTick onClick={handlePhotoUpload} style={{
                    color:'blue',
                    height:'30px',
                    width:'30px',
                    marginLeft:"30px",
                    cursor:'pointer'
                  }}/>}</h4>
              <span className="profileInfoDesc">Hello my friends!</span>
            </div> */}
          </div>
          <div className="profileRightBottom">
            <Feed fetchFor="self" />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
