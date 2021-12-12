import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    UPLOAD_PROFILE_PICTURE_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESS,
    UPLOAD_PROFILE_PICTURE_FAIL,
    SET_USER_DESCRIPTION_FAIL,
    SET_USER_DESCRIPTION_SUCCESS,
} from "../actions/types";
  
const user = JSON.parse(localStorage.getItem("GROUPOMANIA_USER"));
  
const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };
 
export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case REGISTER_SUCCESS:
        return {
          ...state,
          isLoggedIn: false,
        };
      case REGISTER_FAIL:
        return {
          ...state,
          isLoggedIn: false,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoggedIn: true,
          user: payload.user,
        };
      case LOGIN_FAIL:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      case CHANGE_PASSWORD_SUCCESS:
      case SET_USER_DESCRIPTION_SUCCESS:
      case SET_USER_DESCRIPTION_FAIL:
            return {
              ...state,
            };
      case CHANGE_PASSWORD_FAIL:
            return {
              ...state
            };
      case UPLOAD_PROFILE_PICTURE_SUCCESS:
            //  le state contient l'anccien photo , on update cela  
            state.user.profile_picture = payload
            localStorage.setItem("GROUPOMANIA_USER", JSON.stringify(state.user));
            return {
                  ...state
            };
      case SET_USER_DESCRIPTION_SUCCESS:
          //  le state contient l'anccien description , on update cela  
          state.user.description = payload
          localStorage.setItem("GROUPOMANIA_USER", JSON.stringify(state.user));
          return {
              ...state
          };
      case UPLOAD_PROFILE_PICTURE_FAIL:
            return {
                  ...state
                };
      default:
        return state;
    }
}