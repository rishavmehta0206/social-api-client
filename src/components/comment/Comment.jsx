import React, { useEffect, useState } from "react";
import "./comment.css";
import axios from "axios";
import { AiOutlineLike } from "react-icons/ai";
import { BsReplyAll } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import { usePostContext } from "../../context/PostContext/PostProvider";
import CommonInput from "../commoninput/CommonInput";
const Comment = ({ comments, postId, addComment }) => {
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();
  const { dispatch } = usePostContext();
  
  console.log('comments',comments)

  return (
    <div
      style={{
        height: comments.length > 0 ? "200px" : "0px",
        overflowY:'auto',
        padding: "20px",
      }}
    >
      <div
        className=""
      >
        {comments?.map((comment) => (
          <Comm
            comment={comment}
            level={0}
            addComment={addComment}
            dispatch={dispatch}
          />
        ))}
      </div>
      <div
        style={{
          height: "50px",
        }}
        className=""
      >
      </div>
    </div>
  );
};

export default Comment;

function Comm({ comment, level, addComment, dispatch }) {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState(false);

  function likeComment(commentId) {
    axios
      .put("https://social-api-server.vercel.app/api/comment/like-comment/" + commentId, {
        userId: "6654d45f37b6de64419ed4bf",
      })
      .then((data) =>
        dispatch({ type: "LIKE_DISLIKE_COMMENT", payload: data.data })
      );
  }

  return (
    <div className="">
      {/* {JSON.stringify(comment?._id)} */}
      <div
        style={{
          marginLeft: `${level * 30}px`,
          display: "flex",
          marginBottom: "20px",
          gap: "20px",
        }}
        className="comment"
      >
        <img
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          src="http://localhost:3000/assets/person/7.jpeg"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          className=""
        >
          <span>{comment?.userId?.username}</span>
          <p
            style={{
              marginTop: "8px",
            }}
          >
            {comment.comment}
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "6px",
            }}
            className=""
          >
            <div style={{
              display:'flex',
              justifyContent:'center',
              gap:'5px'
            }} className="">
              <img src={"assets/person/like.png"}
                onClick={() => likeComment(comment?._id)}
                style={{
                  height: "20px",
                  width: "20px",
                  cursor: "pointer",
                }}
              />
              {comment?.likes  && comment?.likes.length}
            </div>
            <div className="">
              <BsReplyAll
                onClick={() => setReply(!reply)}
                style={{
                  height: "20px",
                  width: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
          {reply && (
            <CommonInput
              width={'400px'}
              query={query}
              setQuery={setQuery}
              addComment={addComment}
              commentId={comment?._id}
            />
          )}
        </div>
      </div>
      {comment?.reply &&
        comment?.reply.length > 0 &&
        comment.reply?.map((reply) => (
          <Comm
            comment={reply}
            level={level + 1}
            addComment={addComment}
            dispatch={dispatch}
          />
        ))}
    </div>
  );
}
