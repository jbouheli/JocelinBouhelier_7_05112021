import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import validator from 'validator'
import { confirmAlert } from 'react-confirm-alert'; // Import
import "./index.scss"

import Layout from '../../layout'
import anonymuser from '../../assets/anonymous.png'
import eventBus from '../../common/EventBus';
import { changePassword, deletMyAccount, setUserAboutMe, uploadePicture } from '../../actions/user';
import { API_URL } from '../../constants';
import { clearMessage } from '../../actions/message';
import { logout } from '../../actions/auth';


class Profile extends Component {
    constructor(props){
        super(props);
        props.dispatch(clearMessage());
        this.state ={
            oldPassword:"",
            newPassword:"",
            profile_picture:this.props.user?.profile_picture,
            loading:false,
            imageUploading:false,
            loadingAboutMe:false

        }
    }

    handleChange = e=>{
        const {name,value} = e.target ;
        this.setState({[name]:value}) ;
    }
    handleChangePassword = e=>{
        e.preventDefault() ;
        this.setState({loading:true})
        this.props
        .dispatch(changePassword(this.state.oldPassword,this.state.newPassword))
        .then(()=>{
            this.setState({
                oldPassword:"",
                newPassword:"",
                description:""
            })
        })
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            console.log(error)
        })
        .finally(() => {
            this.setState({loading:false})
        });
    }

    ConfirmDeleteAccount = () => {
        confirmAlert({
          title: 'confirmation suppression votre compte',
          message: 'vous etes sur le point de supprimer votre compte, le confirmez-vous ? ',
          buttons: [
            {
              label: 'Oui',
              onClick: () => this.handleDeleteAccount()
            },
            {
              label: 'Non',
              onClick: () => {return;}
            }
          ]
        });
    };

    handleDeleteAccount(){
        this.props
        .dispatch(deletMyAccount())
        .then((data)=>{
            // logout now user
            this.props
            .dispatch(logout()) ;
        })
        .catch((error) => {
            // une erreur
            if (error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            console.log(error)
        })
    }

    onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {

          this.setState({
            profile_picture: URL.createObjectURL(event.target.files[0]),
            imageUploading:true
          });
          this.uploadeuserPicture(event.target.files[0]) ;

        }
    }  
    
    uploadeuserPicture(file){
        this.props
        .dispatch(uploadePicture(file))
        .then((response)=>{
            // tout c'est bien passe
        })
        .finally(()=>this.setState({imageUploading:false}))
        .catch((error) => {
            // une erreur
            if (error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            console.log(error)
        })
    }

    handleSaveABoutMe = e =>{
        e.preventDefault() ;
        console.log(this.state)
        this.setState({loadingAboutMe:true}) ;
        this.props
        .dispatch(setUserAboutMe(this.state.description))
        .then((response)=>{
            // tout c'est bien passe
        })
        .finally(()=>this.setState({loadingAboutMe:false}))
        .catch((error) => {
            // une erreur
            if (error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            console.log(error)
        })
    }


    render() {
        const {message,isLoggedIn} = this.props ;
        const username = this.props.user?.username ;
        const email = this.props.user?.email ;
        const profile_picture = this.props.user?.profile_picture;
        const description = this.props.user?.description;
        const {loading,oldPassword,newPassword,imageUploading,loadingAboutMe} = this.state ;
        
        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <Layout>
                <h1>{username}</h1>
                <section className="profile">
                    <div className="profile--picture">
                        <img 
                            src={profile_picture ? `${API_URL}${profile_picture}` : anonymuser} 
                            ref={img => this.img = img} onError={ () => this.img.src = anonymuser} 
                            alt={`Photo de profil de `+username} />
                        <form>
                            {!imageUploading?(
                                <label htmlFor="picture" className="btn label-file" aria-label="Changer sa photo de profil">Changer ma photo de profil</label>
                            ):(
                                <label disabled  className="btn label-file"> <i class="fa fa-spinner fa-spin"></i>mise a jour</label>
                            )}
                            <input 
                                type="file"
                                accept="image/*"
                                id="picture"
                                className="input-file"
                                onChange={this.onImageChange}
                            />
                        </form>
                    </div>
                    <div className="profile--detail">
                        <div className="profile--detail--description">
                            <h2>Profile</h2>
                            <p className="profile--username"><span className="input-title">Username</span> :&nbsp; {username}</p>
                            <p className="profile--email"><span className="input-title">Email</span> : &nbsp; {email}</p>
                        </div>
                        <hr />
                        <h2>À propos de moi</h2>
                        {/* rendre fonctionnel ce formulaire */}
                        <form  className="form-description" onSubmit={this.handleSaveABoutMe}>
                            <label htmlFor="user-description">
                                <textarea required name="description" value={description} onChange={this.handleChange} />
                            </label>
                            {!loadingAboutMe ?
                            (
                                <button class="btn" type="submit">Enregistrer</button>
                            ):
                            (
                                <button class="btn" disabled type="submit"><i class="fa fa-spinner fa-spin"></i> Loading</button>
                            )}
                        </form>
                        <hr />
                        <h2>Changer de mot de passe</h2>
                        <div className="errors--message">
                           {message}
                        </div>
                        <form  className="form-password-change" onSubmit={this.handleChangePassword}>
                            <label htmlFor="oldPassword">Mot de passe actuel
                                <input required type="password" id="oldPassword" name="oldPassword" value={oldPassword} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="newPassword">Nouveau mot de passe
                                <input required type="password" id="newPassword" name="newPassword" value={newPassword} onChange={this.handleChange} />
                            </label>
                            {!loading ?
                            (
                                <button class="btn" type="submit">Enregistrer</button>
                            ):
                            (
                                <button class="btn" disabled type="submit"><i class="fa fa-spinner fa-spin"></i> Loading</button>
                            )}
                        </form>
                        <hr />
                        <h2>Supprimer le compte</h2>
                        <div className="delete--profile">
                            <button className="delete--profile--btn" onClick={this.ConfirmDeleteAccount}>delete profile</button>
                        </div>
                    </div>
                </section>
                
            </Layout>
        )
    }
}


function mapStateToProps(state) {
    const { user,isLoggedIn } = state.auth;
    const {message} = state.message;
    return {
        user,
      message,
      isLoggedIn
    };
}
  
export default connect(mapStateToProps)(Profile);
