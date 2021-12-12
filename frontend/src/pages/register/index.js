import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import validator from 'validator'
import { toast} from 'react-toastify';


import Layout from '../../layout'

import "./index.scss"
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../../actions/auth';
import { clearMessage } from '../../actions/message';

class Regiser extends React.Component {
    constructor(props){
        super(props);
        props.dispatch(clearMessage());
        this.initiateState()
    }
    initiateState(){
        this.state = {
            username: "",
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
        this.props
        .dispatch(
            register(this.state.username, this.state.email, this.state.password)
        )
        .then(() => {
          const { message } = this.props;
          this.setState({
            successful: true,
            loading:false
          });
          this.setState({
            username: "",
            email: "",
            password: "",
          }) ;
          toast(message)
        })
        .catch(() => {
          this.setState({
            successful: false,
            loading:false
          });
        });
    }
    handleValidation(){
        const {username,password,email} = this.state ;
        let errors = {};
        let formIsValid = true;

        // username
        if (!username) {
            formIsValid = false;
            errors["username"] = "username est requis";
        }
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
        const {password,email,username,loading} = this.state ;
        const {message,isLoggedIn} = this.props ;
        if (isLoggedIn) {
            return <Redirect to="/home" />;
          }
        return (
            <Layout>
                <div className="login">
                    <form className="login--form" onSubmit={this.handleSubmit}>
                        <h1>Créer un compte</h1>
                        <div className="errors--message">
                           {message}
                        </div>
                        <fieldset>
                            <label for="name">Nom</label>
                            <input  id="name" name="username" value={username} type="name" onChange={this.handleChange} />
                            <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                        </fieldset>
                        <fieldset>
                            <label for="email">Email</label>
                            <input id="email"  type="email" name="email" value={email} onChange={this.handleChange} />
                            <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                        </fieldset>
                        <fieldset>
                            <label for="password">Mot de passe</label>
                            <input  id="password" type="password" name="password" value={password} onChange={this.handleChange} />
                            <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                        </fieldset>
                        {!loading ?
                        (
                            <button class="btn" type="submit">S'inscrire</button>
                        ):
                        (
                            <button class="btn" disabled type="submit"><i class="fa fa-spinner fa-spin"></i> Loading</button>
                        )}
                    </form>
                    <p>Vous avez déjà un compte ?  <Link to="/login"><a>Identifiez vous !</a></Link></p>
                </div>
            </Layout>
        )
    }
}


const mapStateToProps = function(state) {
    const { message } = state.message;
    const {isLoggedIn}=state.auth ;
    return {
      message,
      isLoggedIn
    };
}

export default connect(mapStateToProps)(Regiser) ;