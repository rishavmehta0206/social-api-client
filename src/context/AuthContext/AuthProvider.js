import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const reducerAuthFunction = (state, { type, payload }) => {
  // console.log(type,payload)
    switch(type){
        case "LOGIN":{
            return {...state,user:payload};
        }
        case "GET_ALL_USERS":{
          console.log('GET_ALL_USERS',payload)
          return {...state,users:payload}
        }
        case "FOLLOW_UNFOLLOW":{
          let updatedUsers = state.users.map((user)=>{
            if(user?._id === payload?._id){
              return payload
            }
            return user;
          })
          console.log('FOLLOW_UNFOLLOW',state,updatedUsers)
          return {...state,users:updatedUsers}
        }
        case "UPDATE_USER":{
          console.log("UPDATE_USER",payload)
          return {...state,user:{...payload,token:state.user.token}}
        }
        case "LOGOUT":{
          localStorage.removeItem('user');
          return {...state,user:null}
        }
        default:
            return state;
    }
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducerAuthFunction, {
    user: JSON.parse(localStorage.getItem("user")) || null,
    users:[],
    loading:false,
    error:null
  });

  useEffect(()=>{
    localStorage.setItem('user',JSON.stringify(state.user))
  },[state.user])

  return (
    <>
      <AuthContext.Provider value={{dispatch,user:state.user,users:state.users}}>{children}</AuthContext.Provider>
    </>
  );
}

export const useAuthContext = () => useContext(AuthContext);

