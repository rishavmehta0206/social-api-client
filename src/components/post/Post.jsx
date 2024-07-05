import "./post.css";
import { MoreVert } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { usePostContext } from "../../context/PostContext/PostProvider";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import { IoSend } from "react-icons/io5";
import { BsReplyAll } from "react-icons/bs";
import Comment from "../comment/Comment";
import CommonInput from "../commoninput/CommonInput";

export default function Post({ post }) {
  const [showComment, setShowComment] = useState(false);
  const [query, setQuery] = useState("");
  const [comments, setComments] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { userPost, dispatch } = usePostContext();
  const { user: loggedInUser } = useAuthContext();
  const postRef = useRef();

  let endPoint = "https://social-api-server.vercel.app/images/";
  let userImage =
    post?.userId?.profilePicture.length > 0
      ? post?.userId?.profilePicture
      : "public/person/noAvatar.png";

  console.log("post", post, loggedInUser);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:8800/api/user?userId=${post?.userId}`)
  //     .then((res) => setUser(res.data));
  // }, []);

  function handleLikeDislike(type) {
    if (type === "like") {
      axios
        .put(
          `https://social-api-server.vercel.app/api/post/${post?._id}/like`,
          {
            userId: loggedInUser?._id,
          }
        )
        .then((res) => dispatch({ type: "LIKE", payload: res.data }));
    } else {
      axios
        .put(
          `https://social-api-server.vercel.app/api/post/${post?._id}/dislike`,
          {
            userId: loggedInUser?._id,
          }
        )
        .then((res) => dispatch({ type: "DISLIKE", payload: res.data }));
    }
  }

  useEffect(() => {
    axios
      .get(
        `https://social-api-server.vercel.app/api/comment/get-comments/${post?._id}`
      )
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: "SET_COMMENTS",
          payload: { postId: post?._id, comments: res.data },
        });
      });
  }, []);

  console.log("userPost", post);

  async function addComment(comment, id = null) {
    let response = null;
    if (id != null) {
      response = await axios.post(
        `https://social-api-server.vercel.app/api/comment/reply/${id}`,
        {
          userId: loggedInUser?._id,
          postId: post?._id,
          comment: comment,
        }
      );
      response = response.data;
    } else {
      response = await axios.post(
        "https://social-api-server.vercel.app/api/comment/add-comment",
        {
          userId: loggedInUser?._id,
          postId: post?._id,
          comment: comment,
        }
      );
      response = response.data;
    }
    if (response) {
      dispatch({
        type: "ADD_COMMENT",
        payload: { postId: post._id, comment: response, commentId: id },
      });
    }
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate(`/profile/${loggedInUser?.username}`)}
              className="postProfileImg"
              // src={"http://localhost:3000/assets/" + user?.profilePicture}
              src={userImage}
              alt=""
            />
            <span className="postUsername">{post?.userId?.username}</span>
            <span className="postDate">{post.date}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img
            className="postImg"
            src={post.img}
            // src={"http://localhost:8800/images/" + post.img}
            alt=""
          />
        </div>
        <div
          style={{
            display: "flex",
          }}
          className="postBottom"
        >
          <div className="postBottomLeft">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
              }}
              className=""
            >
              <div
                  onClick={() => handleLikeDislike("like")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  border: "0.6px solid lightgray",
                  padding: "10px",
                  borderRadius: "25px",
                  cursor: "pointer",
                }}
                className=""
              >
                {/* <AiOutlineLike
                  style={{
                    height: "30px",
                    width: "30px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleLikeDislike("like")}
                /> */}
                <img
                  style={{
                    width: "30px",
                  }}
                  src="assets/person/like.png"
                />
                <div
                  style={{
                    backgroundColor: "lightgray",
                    height: "35px",
                    position: "relative",
                    width: "1px",
                  }}
                  className=""
                ></div>
                <div style={{}} className="">
                  {post?.likes.length > 0 && post?.likes.length} Likes
                </div>
              </div>
              <div
                onClick={() => setShowComment((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  border: "0.6px solid lightgray",
                  padding: "10px",
                  borderRadius: "25px",
                  cursor:"pointer"
                }}
                className=""
              >
                <FaComment
                  style={{
                    color: "lightblue",
                    width: "30px",
                    height: "30px",
                  }}
                />
                <div
                  style={{
                    backgroundColor: "lightgray",
                    height: "35px",
                    position: "relative",
                    width: "1px",
                  }}
                  className=""
                ></div>
                <div className="">
                  {post.comments.length > 0 ? post.comments.length : 0} Comments
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div
            ref={postRef}
            style={{
              width: "500px",
            }}
          >
            <CommonInput
              query={query}
              setQuery={setQuery}
              addComment={addComment}
              commentId={null}
            />
          </div>
        </div>
      </div>
      {showComment && (
        <Comment
          comments={post?.comments}
          postId={post?._id}
          addComment={addComment}
        />
      )}
    </div>
  );
}
