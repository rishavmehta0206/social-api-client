import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { Posts } from "../../dummyData";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import axios from "axios";
import { usePostContext } from "../../context/PostContext/PostProvider";
export default function Feed({ fetchFor }) {
  const { dispatch, userPost } = usePostContext();
  const { user ,users} = useAuthContext();
  const [posts, setPosts] = useState(null);
  // const [fetchUrl] = useState(
  //   fetchFor === "self"
  //     ? `http://localhost:8800/api/post/my-posts/${user?._id}`
  //     : `http://localhost:8800/api/post/timeline/${user?._id}`
  // );
  let fetchURL =
    fetchFor === "self"
      ? `https://social-api-server.vercel.app/api/post/my-posts/${user?._id}`
      : `https://social-api-server.vercel.app/api/post/timeline/${user?._id}`;

  useEffect(() => {
    axios.get(fetchURL).then((res) => {
      dispatch({ type: "GET_USER_TIMELINE", payload: res.data.sort((p1,p2)=>{
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }) });
    });
  }, [users?.find(use => use?._id === user?._id)?.followings.length]);
  console.log('first',users?.find(use => use?._id === user?._id)?.followings.length)

  function handleSort(selection){
    dispatch({type:"SORT",payload:selection})
  }
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        <FeedType dispatch={dispatch} handleSort={handleSort}/>
        {userPost?.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}

function FeedType({dispatch,handleSort}){
  return <div style={{
    display:'flex',
    marginTop:'15px'
  }} className="">
    <div onClick={()=>handleSort('latest')} style={{
      flex:'1',
      display:'flex',
      justifyContent:'center',
      cursor:'pointer',
      alignItems:'center'
    }} className="">
      <img style={{
        width:'40px',
        height:'40px'
      }} src="/assets/person/calendar.png"/>
      Latest
    </div>
    <div onClick={()=>handleSort('trending')} style={{
      flex:'1',
      display:'flex',
      justifyContent:'center',
      cursor:'pointer',

      borderLeft:'2px solid black',
      alignItems:'center'
    }} className="">
    <img style={{
        width:'40px',
        height:'40px'
      }} src="/assets/person/fire.png"/>
      Trending
    </div>
  </div>
}
