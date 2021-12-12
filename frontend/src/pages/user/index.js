import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import validator from 'validator'
import { confirmAlert } from 'react-confirm-alert'; // Import
import "./index.scss"

import Layout from '../../layout'
import anonymuser from '../../assets/anonymous.png'
import eventBus from '../../common/EventBus';
import { changePassword, getUserData, uploadePicture } from '../../actions/user';
import { API_URL } from '../../constants';
import { clearMessage } from '../../actions/message';
import { getAllPostsByUser } from '../../actions/posts';
import PostItem from '../../components/postItem';


class User extends Component {
    constructor(props){
        super(props);
        this.state ={
            user:{
                profile_picture:"",
                username:"",
                email:"",
                description:""
            },
            loading:true,
            posts:[]

        }
    }
    
    componentDidMount(){
        let viewuserId = window.location.pathname.split('/').pop();
        if(!viewuserId){
            return <Redirect to="/login" />;
        }
        this.loadUserData(viewuserId) ;
        this.loadUserPost(viewuserId) ;
        this.setState({loading:false}) ;

    }

    loadUserData(userId){
        this.props
        .dispatch(getUserData(userId))
        .then((data)=>{
            this.setState({
                user:{
                    username:data.user.username,
                    profile_picture:data.user.profile_picture,
                    email:data.user.email,
                    description:data.user.description
                }
            })
        })
        .catch((error) => {
            // une erreur
            if (error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            console.log(error)
        })
    }

    loadUserPost(userId){
        this.props
        .dispatch(getAllPostsByUser(userId))
        .then((data)=>{
            console.log(data.posts)
            this.setState({
                posts:data.posts
            })
        })
        .catch((error) => {
            // une erreur
            if (error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            console.log(error)
        })
    }

    render() {
        const {isLoggedIn,user} = this.props ;
        const username = this.state.user?.username ;
        const email = this.state.user?.email ;
        const profile_picture = this.state.user?.profile_picture;
        const description = this.state.user?.description ;
        const {loading,posts} = this.state ;
        
        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <Layout>
                {loading ?
                    (
                        <><i class="fa fa-spinner fa-spin"></i> Loading</>     
                    ):
                    (
                        <>
                            <h1>{username}</h1>
                            <section className="profile">
                                <div className="profile--picture">
                                    <img 
                                        src={profile_picture ? `${API_URL}${profile_picture}` : anonymuser} 
                                        ref={img => this.img = img} onError={ () => this.img.src = anonymuser} 
                                        alt={`Photo de profil de `+username} />
                                </div>
                                <div className="profile--detail">
                                    <div className="profile--detail--description">
                                        <h2>Profile</h2>
                                        <p className="profile--username"><span className="input-title">Username</span> :&nbsp; {username}</p>
                                        <p className="profile--email"><span className="input-title">Email</span> : &nbsp; {email}</p>
                                    </div>
                                    <hr />
                                    <h2>À propos de moi</h2>
                                    <div className="errors--message">
                                    {/* {message} */}
                                    </div>
                                    {/* rendre fonctionnel ce formulaire */}
                                    <form  className="form-description" >
                                        <label htmlFor="user-description">
                                            <textarea name="description" readOnly={true} value={description}  />
                                        </label>
                                    </form>
                                </div>
                            </section>
                            <div className="publications">
                                <h1>Dernières publications</h1>
                                {/* LISTE DES DERNIERES PUBLICATIONS  */}
                                <section className="publications--list">
                                    {posts.map((post,i)=>(
                                        <PostItem  {...this.props} key={i} post={post} index={i} user={user} />
                                    ))}
                                </section>
                            </div>
                        </>
                    )
                }
            </Layout>
        )
    }
}


function mapStateToProps(state) {
    const { isLoggedIn,user } = state.auth;
    return {
      isLoggedIn,
      user,
      router:state.router
    };
}
  
export default connect(mapStateToProps)(User);
