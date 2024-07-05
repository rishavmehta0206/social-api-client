import { IoSend } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";

export default function CommonInput({ query, setQuery, addComment, commentId,width='750px' }) {
  const {user:loggedInUser} = useAuthContext();
  let endPoint = "http://localhost:8800/images/";

  let userImage =
  loggedInUser?.profilePicture?.length > 0
    ? endPoint + loggedInUser?.profilePicture
    : endPoint + "noAvatar.png";
    return (
      <div
        style={{
          // borderBottom: "1px solid black",
          maxwidth: width,
          minWidth:width,
          margin:'30px auto 0px',
          position: "relative",
          display:'flex',
          gap:"20px",
          justifyContent:'',
        }}
        className=""
      >
        <div className="">
        <img
              style={{
                height:'40px'
              }}
              className=""
              src={userImage}
              alt=""
            />
        </div>
        <input
          style={{
            outline: "none",
            height: "40px",
            padding: "15px",
            width: "100%",
            border:'1px solid lightgray',
            borderRadius:'10px'
          }}
          type="text"
          //   value={comment}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write a comment..."
        />
        <IoSend
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            height: "20px",
            width: "20px",
          }}
          onClick={() => addComment(query, commentId)}
        />
      </div>
    );
  }
  