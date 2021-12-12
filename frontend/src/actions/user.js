import _ from "lodash" ;
import {
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    UPLOAD_PROFILE_PICTURE_FAIL,
    SET_MESSAGE,
    UPLOAD_PROFILE_PICTURE_SUCCESS,
    SET_USER_DESCRIPTION_SUCCESS,
    SET_USER_DESCRIPTION_FAIL,
} from "./types";


import UserService from "../services/user.service";


export const changePassword=(oldPassword,newPassword)=> (dispatch) =>{
    return UserService.changePassword(oldPassword,newPassword).then(
        (response)=>{
            dispatch({
                type: CHANGE_PASSWORD_SUCCESS,
              });
        
              dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
              });
        
              return Promise.resolve();
        },
        (error)=>{
            let {message} = error.response.data ;
            dispatch({
                type: CHANGE_PASSWORD_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )
}



export const setUserAboutMe=(description)=> (dispatch) =>{
    return UserService.updateAboutMe(description).then(
        (response)=>{
            dispatch({
                type: SET_USER_DESCRIPTION_SUCCESS,
                payload:description
              });
              return Promise.resolve();
        },
        (error)=>{
            let {message} = error.response.data ;
            dispatch({
                type: SET_USER_DESCRIPTION_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )
}

export const uploadePicture = (file) =>(dispatch)=>{
    return UserService.uploadPicture(file).then(
        (response)=>{
            dispatch({
                type: UPLOAD_PROFILE_PICTURE_SUCCESS,
                payload: response.data.profile_picture,
              });
        
              dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
              });
        
              return Promise.resolve();
        },
        (error)=>{
            let {message} = error.response.data ;
            dispatch({
                type: UPLOAD_PROFILE_PICTURE_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    )
}


export const getUserData = (userId)=>(dispatch)=>{
    return UserService.getUserBasicInformation(userId).then(
        (response)=>{
            return Promise.resolve(response.data);
        },
        (error)=>{
            return Promise.reject(error);
        }
    )
}


export const deletMyAccount = (userId)=>(dispatch)=>{
    return UserService.deleteAccount(userId).then(
        (response)=>{
            return Promise.resolve(response.data);
        },
        (error)=>{
            return Promise.reject(error);
        }
    )
}
  