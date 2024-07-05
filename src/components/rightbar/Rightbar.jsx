import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdModeEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";

export default function Rightbar({ user }) {
  const [followers, setFollowers] = useState({});
  const { user: loggedInUser, dispatch, users } = useAuthContext();
  const [edit, setEdit] = useState(false);
  const cityRef = useRef();
  const fromRef = useRef();
  const relationshipRef = useRef();
  console.log(
    "loggedInUser",
    users?.find((use) => use?._id === loggedInUser?._id)?.followers
  );
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get("https://social-api-server.vercel.app/api/user/users", {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      })
      .then((resp) =>
        setFollowers(
          resp.data.filter((user) => user._id == loggedInUser?._id)[0]
        )
      );
  }, [loggedInUser]);

  let userImage =
  loggedInUser?.profilePicture?.length > 0
    ? loggedInUser?.profilePicture
    : "assets/person/user.png";

  // console.log('followers',followers)

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/post/gift.png" alt="" />
          <span className="birthdayText">
            <b>Rishav Mehta</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/person/ad.jpeg" style={{
          objectFit:'cover'
        }} height={'350px'} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {users
            ?.find((use) => use?._id === loggedInUser?._id)
            ?.followings?.map((u) => (
              <Online key={u.id} user={u} />
            ))}
          {/* {
            followers?.followings?.map((user)=>{
              return <li className="rightbarFriend">
              <div className="rightbarProfileImgContainer">
                <img className="rightbarProfileImg" src={"https://social-api-server.vercel.app/images/noAvatar.png"} alt="" />
                <span className="rightbarOnline"></span>
              </div>
              <span className="rightbarUsername">{user?.username}</span>
            </li>
            })
          } */}
        </ul>
      </>
    );
  };

  const handlePhotoUpload = async (e) => {
    // console.log("city:",cityRef.current)
    const apiBody = {
      userId: loggedInUser?._id,
      city:cityRef.current.value,
      from:fromRef.current.value,
      relationship:relationshipRef.current.value
    };
    if (file) {
      const data = new FormData();
      const fileName = file.name;
      data.append("file", file);
      data.append("name", fileName);
      apiBody.profilePicture = fileName;
      try {
        await axios.post("https://social-api-server.vercel.app/api/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      let { data } = await axios.put(
        `https://social-api-server.vercel.app/api/user/${loggedInUser?._id}`,
        apiBody
      );
      dispatch({ type: "UPDATE_USER", payload: data });
      console.log("responseOfEdit", data);
      setEdit(false)
    } catch (error) {}
  };


  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">
          User information{" "}
          <span
            style={{
              display: "inline-block",
            }}
            className=""
          >
            <MdModeEdit
              onClick={() => setEdit((prev) => !prev)}
              style={{
                cursor: "pointer",
              }}
            />
            {edit && (
              <TiTick
                onClick={handlePhotoUpload}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  marginLeft: "15px",
                }}
              />
            )}
          </span>
        </h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            {edit ? (
              <input
              ref={cityRef}
                // value={city}
                name="city"
                // onChange={(e) =>
                  // setCity(e.target.value)
                // }
                
              />
            ) : (
              <span className="rightbarInfoValue">{loggedInUser?.city}</span>
            )}
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            {edit ? (
              <input
                // value={userDetails?.from}
                name="from"
                ref={fromRef}
                
              />
            ) : (
              <span className="rightbarInfoValue">{loggedInUser?.from}</span>
            )}
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            {edit ? (
              <input
                // value={userDetails?.relationship}
                ref={relationshipRef}
                name="relationship"
                // onChange={(e) =>
                //   setUserDetails((prev) => ({
                //     ...prev,
                //     relationship: e.target.value,
                //   }))
                // }
                
              />
            ) : (
              <span className="rightbarInfoValue">{loggedInUser?.relationship}</span>
            )}
          </div>
          {edit && (
            <div className="">
              <label htmlFor="fileInput">
                <img
                  style={{
                    cursor: "pointer",
                    height: "40px",
                    width: "40px",
                  }}
                  // className="profileUserImg"
                  src="/assets/person/bgImage.png"
                  alt=""
                />
              </label>
              <input
                type="file"
                style={{
                  display: "none",
                }}
                id="fileInput"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          )}
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          <div className="rightbarFollowing">
            {users
              ?.find((use) => use?._id === loggedInUser?._id)
              ?.followers?.map((user) => (
                <div className="rightbarFollowing">
                  <img
                    src={user?.profilePicture}
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">{user.username}</span>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
