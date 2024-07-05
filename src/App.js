import axios from "axios";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./context/AuthContext/AuthProvider";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  const now = Date.now().valueOf() / 1000;
  return decoded.exp < now;
}

function App() {
  const { user: loggedInUser, dispatch } = useAuthContext();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  useEffect(() => {
    if (loggedInUser) {
      axios
        .get("https://social-api-server.vercel.app/api/user/users", {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        })
        .then((res) =>
          dispatch({
            type: "GET_ALL_USERS",
            payload: res.data,
          })
        );
    }
  }, [loggedInUser]);

  useEffect(() => {
    const checkToken = () => {
      const token = loggedInUser?.token;
      if (token && isTokenExpired(token)) {
        if (!window.location.pathname.includes("/login") && !isLoggedOut) {
          setIsLoggedOut(true);
          window.location.href = "/login";
          dispatch({ type: "LOGOUT_USER" });
        }
      }
    };

    // Check the token once immediately
    checkToken();

    // Set an interval to check the token periodically
    const interval = setInterval(() => {
      checkToken();
    }, 1000 * 60); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [window.location, isLoggedOut]);

  const ProtectedRoute = ({ children, loggedInUser }) => {
    return loggedInUser ? children : <Navigate to="/login" replace />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute loggedInUser={loggedInUser}>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile/:username",
      element: (
        <ProtectedRoute loggedInUser={loggedInUser}>
          <Profile />
        </ProtectedRoute>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
