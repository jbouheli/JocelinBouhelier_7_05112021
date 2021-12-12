import React from 'react'
import { Link,Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import validator from 'validator'

import Layout from '../../layout'

import "./index.scss"
import { login } from '../../actions/auth';
import { clearMessage } from '../../actions/message';

class Login extends React.Component {
    
    constructor(props){
        super(props) ;
        props.dispatch(clearMessage());
        this.initiateState() 

    }
    initiateState(){
        this.state = {
            email: "",
            password: "",
            loading:false,
            successful:false,
            errors:{}
        };
    }
    handleChange = e =>{
        const {name,value} = e.target ;
        this.setState({[name]: value}) ;
    }
    handleSubmit = e =>{
        e.preventDefault();
        //tous est conforme ?
        if(!this.handleValidation()){
            return ;
        }
        this.setState({loading:true})
        const { dispatch, history } = this.props;
        dispatch(login(this.state.email, this.state.password))
        .then(() => {
            history.push("/home");
            window.location.reload();
        })
        .catch(() => {
            this.setState({
                loading: false
            });
        });
    }
    handleValidation(){
        const {username,password,email} = this.state ;
        let errors = {};
        let formIsValid = true;

        // password
        if(!password) {
            formIsValid = false;
            errors['password'] = "password est requis"
        }
        if(!validator.isEmail(email)) {
            formIsValid = false;
            errors['email'] = "email doit etre une email valide"
        }

        this.setState({errors:errors})
        return formIsValid ;
    }

    render(){
        const {password,email,loading} = this.state ;
        const { isLoggedIn, message } = this.props;

        if (isLoggedIn) {
          return <Redirect to="/home" />;
        }
        return (
            <Layout>
                <div className="login" onSubmit={this.handleSubmit}>
                    <form className="login--form">
                        <h1>Identifiez-vous</h1>
                        <div className="errors--message">
                           {message}
                        </div>
                        <fieldset>
                            <label for="email">Email</label>
                            <input id="email" value={email}  type="email" name="email" onChange={this.handleChange} />
                            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                        </fieldset>
                        <fieldset>
                            <label for="password">Mot de passe</label>
                            <input id="password" type="password" value={password} name="password" onChange={this.handleChange} />
                            <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                        </fieldset>
                        {!loading ?
                        (
                            <button class="btn" type="submit">Se connecter</button>
                        ):
                        (
                            <button class="btn" disabled type="submit"><i class="fa fa-spinner fa-spin"></i> Loading</button>
                        )}
                    </form>
                    <p>Pas encore inscrit ? <Link to="/register"><a>Créer un compte</a></Link></p>
                </div>
            </Layout>
        )
    }
}


function mapStateToProps(state) {
    const { isLoggedIn } = state.auth;
    const { message } = state.message;
    return {
      isLoggedIn,
      message
    };
}
  
export default connect(mapStateToProps)(Login);
