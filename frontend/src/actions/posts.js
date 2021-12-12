import _ from "lodash" ;
import {
    POST_MESSAGE_FAIL,
    POST_MESSAGE_SUCCESS,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,
    SET_MESSAGE,
    LIKE_COMMENT_SUCCESS,
    LIKE_COMMENT_FAIL,
    COMMENT_POST_SUCCESS,
    COMMENT_POST_FAIL,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT_FAIL,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL,
    REPORT_POST_SUCCESS,
    REPORT_POST_FAIL,
    GET_REPORTED_POSTS_SUCCESS,
    GET_REPORTED_POSTS_FAIL,
} from "./types";

import PostService from "../services/post.service";

export const publishPost = (content,filename) => (dispatch) => {
  return PostService.postMessage(content,filename).then(
    (response) => {
      dispatch({
        type: POST_MESSAGE_SUCCESS,
        payload:{post:response.data.post}
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      let {message,errors} = error.response.data ;
      // console.log(errors)
      if(!_.isEmpty(errors)){
         message=Object.keys(errors).map(function (key, index) {
          return errors[key]
        }).join(', ')
      }
      dispatch({
        type: POST_MESSAGE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const getAllPosts = () => (dispatch)=>{
    return PostService.gettAllPosts().then(
        (response)=>{
            dispatch({
                type: GET_POSTS_SUCCESS,
                payload:{posts:response.data.posts}
            });
            
            return Promise.resolve();
        },
        (error) => {
            let {message,errors} = error.response.data ;
            // console.log(errors)
            if(!_.isEmpty(errors)){
               message=Object.keys(errors).map(function (key, index) {
                return errors[key]
              }).join(', ')
            }
            dispatch({
              type: GET_POSTS_FAIL,
            });
      
            dispatch({
              type: SET_MESSAGE,
              payload: message,
            });
      
            return Promise.reject();
      }
    )
}


export const getAllPostsByUser = (userId)=>(dispatch)=>{
  return PostService.getPostsByUserId(userId).then(
      (response)=>{
          return Promise.resolve(response.data);
      },
      (error)=>{
          return Promise.reject(error);
      }
  )
}


export const getAllReportedPosts = () => (dispatch)=>{
  return PostService.gettAllReportedPosts().then(
      (response)=>{
          dispatch({
              type: GET_REPORTED_POSTS_SUCCESS,
              payload:{posts:response.data.posts}
          });
          
          return Promise.resolve();
      },
      (error) => {
          let {message,errors} = error.response.data ;
          // console.log(errors)
          if(!_.isEmpty(errors)){
             message=Object.keys(errors).map(function (key, index) {
              return errors[key]
            }).join(', ')
          }
          dispatch({
            type: GET_REPORTED_POSTS_FAIL,
          });
    
          dispatch({
            type: SET_MESSAGE,
            payload: message,
          });
    
          return Promise.reject();
    }
  )
}


export const likeOrUnLikePost = (postId,option) =>(dispatch)=>{
  return PostService.likePost(postId,option).then(
    (response)=>{
      const {postId,userId} = response.data
      dispatch({
          type: LIKE_COMMENT_SUCCESS,
          payload: {postId,userId,option}
      });
      
      return Promise.resolve();
    },
    (error) => {
        let {message,errors} = error.response.data ;
        // console.log(errors)
        if(!_.isEmpty(errors)){
          message=Object.keys(errors).map(function (key, index) {
            return errors[key]
          }).join(', ')
        }
        dispatch({
          type: LIKE_COMMENT_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
    }
  )
}

export const commentPost =(postId,content)=>(dispatch)=>{
  return PostService.commentPost(postId,content).then(
    (response)=>{
      // refresh the post getpostbyid
      const {comment,message} = response.data
      dispatch({
          type: COMMENT_POST_SUCCESS,
          payload: {comment,postId}
      });

      
      return Promise.resolve(response.data);
    },
    (error) => {
        let {message,errors} = error.response.data ;
        // console.log(errors)
        if(!_.isEmpty(errors)){
          message=Object.keys(errors).map(function (key, index) {
            return errors[key]
          }).join(', ')
        }
        dispatch({
          type: COMMENT_POST_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
    }
  )
}


export const deleteCurrentPost =(postId)=>(dispatch)=>{
  return PostService.deletePost(postId).then(
    (response)=>{
      const {message} = response.data
      dispatch({
          type: DELETE_POST_SUCCESS,
          payload: {postId}
      });

      
      return Promise.resolve(response.data);
    },
    (error) => {
        let {message,errors} = error.response.data ;
        // console.log(errors)
        if(!_.isEmpty(errors)){
          message=Object.keys(errors).map(function (key, index) {
            return errors[key]
          }).join(', ')
        }
        dispatch({
          type: DELETE_POST_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
    }
  )
}



export const reportCurrentPost =(postId)=>(dispatch)=>{
  return PostService.reportPost(postId).then(
    (response)=>{
      dispatch({
          type: REPORT_POST_SUCCESS
      });

      return Promise.resolve();
    },
    (error) => {
        let {message,errors} = error.response.data ;
        // console.log(errors)
        if(!_.isEmpty(errors)){
          message=Object.keys(errors).map(function (key, index) {
            return errors[key]
          }).join(', ')
        }
        dispatch({
          type: REPORT_POST_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
    }
  )
}



export const deleteComment=(commentId,postId)=>(dispatch)=>{
  return PostService.deleteComment(commentId).then(
    (response)=>{
      const {comment} = response.data
      dispatch({
          type: DELETE_COMMENT_SUCCESS,
          payload: {comment,postId,commentId}
      });
      return Promise.resolve(response.data);
    },
    (error)=>{
        let {message,errors} = error.response.data ;
        // console.log(errors)
        if(!_.isEmpty(errors)){
          message=Object.keys(errors).map(function (key, index) {
            return errors[key]
          }).join(', ')
        }
        dispatch({
          type: DELETE_COMMENT_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
    }
  )
}