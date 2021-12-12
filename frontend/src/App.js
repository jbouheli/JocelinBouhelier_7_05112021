import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


import Home from './pages/home';
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import User from "./pages/user";

import { clearMessage } from "./actions/message";

import { history } from './helpers/history';
import EventBus from "./common/EventBus";

import React from "react";
import { logout } from "./actions/auth";
import Report from "./pages/report";


class App extends React.Component {
  constructor(props){
    super(props);
    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  }
  componentWillUnmount() {
    EventBus.remove("logout");
  }
  logOut() {
    this.props.dispatch(logout());
  }
  
  render(){
    const { isLoggedIn} = this.props;
    
    return (
      <Router history={history}>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/user/profile/:userId">
            <User />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/report-posts">
            <Report />
          </Route>
          <Route exact path={["/", "/home"]}>
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = function(state) {
  const { user,isLoggedIn } = state.auth;
  return {
    user,
    isLoggedIn
  };
}


export default connect(mapStateToProps)(App);
