import React from 'react'
import {
    Link,
    Redirect
} from "react-router-dom";

import { connect } from "react-redux";
import "./index.scss"

import logo from "../../assets/logo.svg"
import anonymuser from '../../assets/anonymous.png'
import { logout } from '../../actions/auth';
import { clearMessage } from '../../actions/message';
import { API_URL } from '../../constants';

function Header(props) {
    const {isLoggedIn,dispatch, history} = props ;
    const username = props.user?.username;
    const loggout = () =>{
        dispatch(logout()) ;
    }

    return (
        <header className="header">
            <div className="main-wrapper header--wrapper">
                <Link to="/">
                    <img  className="header--logo" src={logo} alt="Logo de Groupomania" />
                </Link>
                {isLoggedIn 
                ? (
                    // Si l'utilisateur est loggé
                    <nav  className="header--nav">
                        {props.user.isAdmin && (
                            <Link to="/report-posts">
                                <div className="moderation">
                                    <i class="fas fa-comment-slash"></i> Posts Signaler
                                </div>
                            </Link>
                        )}
                        <Link to="/profile">
                            <div className="header--nav--profile" title={"profil de "+username}>
                                <img src={props.user?.profile_picture ? `${API_URL}${props.user?.profile_picture}` : anonymuser} alt={"Photo de profil"+username} />
                            </div>
                        </Link>
                        <button type="button" onClick={loggout} className="btn--logout" aria-label="Se déconnecter" title="Se déconnecter">
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </nav>
                ):(
                    // Si l'utilisateur n'est pas encore loggé 
                    <nav className="header--nav">
                        <Link to="/login">
                            <a>S'identifier</a>
                        </Link>
                        <Link to="/register">
                            <a>S'inscrire</a>
                        </Link>
                    </nav>
                )}
                
                
            </div>
        </header>
    )
}


const mapStateToProps = function(state) {
    const {isLoggedIn,user}=state.auth ;
    return {
      isLoggedIn,
      user
    };
}

export default connect(mapStateToProps)(Header) ;

