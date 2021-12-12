import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

import auth from "./auth";
import message from "./message";
import posts from "./posts" ;


const createRootReducer = (history) => combineReducers({
  auth,
  message,
  posts,
  router: connectRouter(history),
});


export default createRootReducer ;