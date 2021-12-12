import React from 'react'

import { connect } from "react-redux";
import { publishPost } from '../../actions/posts';
import eventBus from '../../common/EventBus';


import "./index.scss"

class Post extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={
            postBody:"",
            profilePicture:null,
            previewFile:null,
            loading:false,
        }
    }

    handleChange = e =>{
        const {name,value}= e.target ;
        this.setState({[name]:value})
    }

    submitPost = e=>{
        e.preventDefault();
        this.setState({loading:true})
        this.props 
        .dispatch(publishPost(this.state.postBody,this.state.profilePicture))
        .then(response=>{
            // console.log(response)
            this.setState({
                postBody:"",
                profilePicture:null,
                previewFile:null,
            })
        })
        .finally(()=>{
            this.setState({loading:false})
        })
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            // console.log(error)
        })
    }

    

    onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          this.setState({
            previewFile: URL.createObjectURL(event.target.files[0]),
            profilePicture:event.target.files[0]
          });
        }
    }  

    render(){
        const {previewFile,postBody,loading} = this.state ;
        return (
            <section className="publications--add">
                <form  onSubmit={this.submitPost} >
                    <h2>Exprimez-vous...</h2>
                    <p>
                        <label htmlFor="addPub-content" className="hidden">Votre contenu de publication</label>
                        <textarea onChange={this.handleChange} required  name="postBody" value={postBody} placeholder="Ajouter un texte" id="addPub-content" />
                    </p>
                    {previewFile && (
                        <div className="image-post-preview">
                            <img 
                                src={previewFile} 
                                ref={img => this.img = img} 
                            />
                        </div>
                    )}
                    
                    <p className="buttons">
                        <label for="addPub-image" className="btn">Choisir une image
                        <input disabled={loading} name="profilePicture"  type="file" id="addPub-image" onChange={this.onImageChange} />
                        </label>
                        {!loading ?
                            (
                                <button type="submit" className="btn">Publier !</button>
                            ):
                            (
                                <button class="btn" disabled type="submit"><i class="fa fa-spinner fa-spin"></i> Loading</button>
                        )}
                    </p>
                </form>
            </section>
        )
    }
}


const mapStateToProps = function(state) {
    const {isLoggedIn,user}=state.auth ;
    return {
      isLoggedIn,
      user
    };
}

export default connect(mapStateToProps)(Post) ;
