import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

import thunk from "redux-thunk";
import createRootReducer from "./reducers";

export const history = createBrowserHistory()

const middleware = [thunk,routerMiddleware(history)];

const store = createStore(
  createRootReducer(history),
  composeWithDevTools(
    applyMiddleware(
      ...middleware
    )
  )
);

export default store;