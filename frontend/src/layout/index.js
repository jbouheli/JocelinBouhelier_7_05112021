import React from 'react';
import Header from '../components/header';
import { ToastContainer } from 'react-toastify';

import "../style.scss"
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const Layout =(props) =>{
    return(
        <>
            <Header {...props} />
            <main className="main-wrapper">
                {props.children}
                <ToastContainer />
            </main>
        </>
    )
}

export default Layout;