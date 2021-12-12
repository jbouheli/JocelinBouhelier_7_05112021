import {
    POST_MESSAGE_SUCCESS,
    POST_MESSAGE_FAIL,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,
    LIKE_COMMENT_SUCCESS,
    COMMENT_POST_SUCCESS,
    COMMENT_POST_FAIL,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT_FAIL,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL,
    REPORT_POST_SUCCESS,
    REPORT_POST_FAIL,
    GET_REPORTED_POSTS_SUCCESS,
    GET_REPORTED_POSTS_FAIL
} from "../actions/types";


  
const initialState = { allPosts: [],reportedPosts:[] } ;


export default function (state = initialState, action) {
        const { type, payload } = action;
      
        switch (type) {
          case POST_MESSAGE_SUCCESS:
              state.allPosts.unshift(payload.post) ;
              return {
                  ...state,
              }
          case DELETE_POST_SUCCESS:
            let arr_posts = state.allPosts.filter(post=>{
                return post.id != payload.postId
            }) ;
            state.allPosts = arr_posts
            return {
                ...state,
            }
         case DELETE_POST_FAIL:
            return {
                ...state
            };
          case POST_MESSAGE_FAIL:
              return {
                  ...state
              };
          case GET_POSTS_SUCCESS:
            state.allPosts = payload.posts;
            return {
                    ...state
            };
          case GET_REPORTED_POSTS_SUCCESS:
            state.reportedPosts = payload.posts;
            return {
                ...state
            };
          case REPORT_POST_SUCCESS:
          case REPORT_POST_FAIL:
          case GET_REPORTED_POSTS_FAIL:
            return {
                    ...state
            };
          case GET_POSTS_FAIL:
            return {
                ...state
            };
          case LIKE_COMMENT_SUCCESS:
            // parcourrons ceci 
            state.allPosts.map((post)=>{
                if(post.id==payload.postId){
                    // console.log(`voila le post representer ==> ${payload.postId}`)
                    let likes = JSON.parse(post.usersLikes) ;
                    if(payload.option==1){
                        likes.push(payload.userId) ;
                        post.usersLikes = JSON.stringify(likes)
                    }else if(payload.option==-1){
                        likes.pop(payload.userId) ;
                        post.usersLikes = JSON.stringify(likes)
                    }
                    // return post ;
                }
                // return post ;
            }) ;
            // console.log(state.allPosts) ;
            return {
                ...state
            } ;
          case COMMENT_POST_SUCCESS:
            state.allPosts.map(post=>{
                // on recupere post commente
                if(post.id==payload.postId){
                    post.comments.push(payload.comment)
                    return post
                }
                return post ;
            })
            return {
                ...state
            }
          case DELETE_COMMENT_SUCCESS:
                state.allPosts.map(post=>{
                    // on recupere post commente
                    if(post.id==payload.postId){
                        let new_array_comment = post.comments.filter(comment=>{
                            return comment.id != payload.commentId
                        })
                        post.comments = new_array_comment
                        return post
                    }
                    return post ;
                })
                // console.log(state) ;
                return {
                    ...state
                }
          case COMMENT_POST_FAIL:
                return {
                    ...state
                };
          case DELETE_COMMENT_FAIL:
                return {
                    ...state
                };
          default:
            return state;
        }
}