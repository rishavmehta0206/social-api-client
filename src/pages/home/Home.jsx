import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const { user: loggedInUser, dispatch } = useAuthContext();

  return (
    <div >
      <Topbar />
      <div style={{
      maxWidth:'1680px',
      margin:'0px auto'
    }} className="homeContainer">
        <Sidebar />
        <Feed fetchFor="all" />
        <Rightbar />
      </div>
    </div>
  );
}
