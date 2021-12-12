import _ from "lodash" ;
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
} from "./types";

import AuthService from "../services/auth.service";

export const register = (username, email, password) => (dispatch) => {
  return AuthService.register(username, email, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
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
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};


export const login = (username, password) => (dispatch) => {
  return AuthService.login(username, password).then(
    (response) => {
      if (response.data.token) {
        localStorage.setItem("GROUPOMANIA_USER", JSON.stringify(response.data));
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: response.data },
      });

      return Promise.resolve();
    },
    (error) => {
      let {error:message,errors} = error.response.data ;
      if(!_.isEmpty(errors)){
        message=Object.keys(errors).map(function (key, index) {
          return errors[key]
        }).join(', ')
      }
      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  });
};
