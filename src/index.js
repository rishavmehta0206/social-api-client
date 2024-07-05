import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext/AuthProvider";
import PostProvider from "./context/PostContext/PostProvider";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <PostProvider>
        <App />
      </PostProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
