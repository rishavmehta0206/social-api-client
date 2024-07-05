import { createContext, useContext, useReducer } from "react";

const PostContext = createContext();

function helperNestedSearch(comments, commentId, comment) {
  console.log("commentBeforeUpdate", comments, commentId, comment);
  for (let comm of comments) {
    if (comm?._id === commentId) {
      comm.reply.push(comment);
      return comments;
    }
    if (comm.reply.length > 0) {
      helperNestedSearch(comm.reply, commentId, comment);
    }
  }
  return comments;
}

function helperLikeFunction(comments, payload) {
  console.log("helperLikeFunction", comments, payload);
  for (let comment of comments) {
    if (comment?._id === payload?._id) {
      comment.likes = payload.likes;
      comment.dislikes = payload.dislikes;
      return comments;
    }
    if (comment.reply.length > 0) {
      helperLikeFunction(comment.reply, payload);
    }
  }
  return comments;
}

const reducerAuthFunction = (state, { type, payload }) => {
  switch (type) {
    case "GET_USER_TIMELINE": {
      return {
        ...state,
        userPost: payload.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }),
      };
    }
    case "ADD_POST": {
      let updatedPosts = [...state.userPost, payload].sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      });
      console.log("updatedPost", updatedPosts);
      return { ...state, userPost: updatedPosts };
    }
    case "LIKE": {
      let updatedPosts = state.userPost?.map((post, index) => {
        if (post?._id === payload?._id) {
          return { ...post, likes: payload.likes, dislikes: payload.dislikes };
        }
        return post;
      });
      return { ...state, userPost: updatedPosts };
    }
    case "DISLIKE": {
      let updatedPosts = state.userPost?.map((post, index) => {
        if (post?._id === payload?._id) {
          return { ...post, likes: payload.likes, dislikes: payload.dislikes };
        }
        return post;
      });
      return { ...state, userPost: updatedPosts };
    }
    case "SET_COMMENTS": {
      console.log("SET_COMMENTS", payload);
      let updatedPost = state?.userPost?.map((post, id) => {
        if (post._id === payload.postId) {
          return { ...post, comments: payload.comments };
        }
        return post;
      });
      return { ...state, userPost: updatedPost };
    }
    case "ADD_COMMENT": {
      console.log("ADD_COMMENT", payload);
      console.log("ADD_COMMENT", state?.userPosts);
      let updatedPosts = state?.userPost?.map((post, index) => {
        if (payload.postId === post?._id) {
          if (payload.commentId === null) {
            console.log("ADD_COMMENT", post);
            return { ...post, comments: [...post.comments, payload.comment] };
          } else {
            return {
              ...post,
              comments: helperNestedSearch(
                post.comments,
                payload.commentId,
                payload.comment
              ),
            };
          }
        }
        return post;
      });
      return { ...state, userPost: updatedPosts };
    }
    case "LIKE_DISLIKE_COMMENT": {
      console.log("LIKE_DISLIKE_COMMENT", payload);
      let updatedPosts = state?.userPost?.map((post, index) => {
        console.log(post, payload.postId);
        if (post._id === payload.postId) {
          console.log("LIKE_DISLIKE_COMMENT", payload);
          return {
            ...post,
            comments: helperLikeFunction(post.comments, payload),
          };
        }
        return post;
      });
      return { ...state, userPosts: updatedPosts };
    }
    case "SORT": {
      console.log('updatedFirstPost',payload)
      let updatedPosts;
      if (payload === "latest") {
        updatedPosts = state.userPost.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
      } else {
        updatedPosts = state.userPost.sort((p1,p2)=>{
          return p2.likes.length - p1.likes.length
        })
      }
      console.log('updatedPost',updatedPosts)
      return {...state,userPost:updatedPosts}
    }
    default:
      return state;
  }
};

export default function PostProvider({ children }) {
  const [state, dispatch] = useReducer(reducerAuthFunction, {
    userPosts: [],
    loading: false,
  });

  return (
    <>
      <PostContext.Provider value={{ dispatch, userPost: state.userPost }}>
        {children}
      </PostContext.Provider>
    </>
  );
}

export const usePostContext = () => useContext(PostContext);
