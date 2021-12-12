
import React, { Component } from 'react'
import moment from 'moment'


import { API_URL } from '../../constants';
import anonymuser from '../../assets/anonymous.png'

import "./index.scss";
import eventBus from '../../common/EventBus';
import { commentPost, deleteComment, likeOrUnLikePost,deleteCurrentPost, reportCurrentPost } from '../../actions/posts';
import { Link } from 'react-router-dom';

class PostItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            // commentLoading:false,
            // commentSubmit:false,
            commentBody:"",
            likeActionloading:false,
            comments:[],
            handleDeleteCurrentPost:false,
            handleReportCurrentPost:false,
            moreOption:false
        }
    }

    componentDidMount(){
        this.setState({comments:this.props.post.comments})
    }

    handleChange = e =>{
        const {name,value} = e.target ;
        this.setState({[name]:value}) ;
    }

    savePostComment = e =>{
        e.preventDefault() ;
        // console.log(this.props.post)
        // console.log(this.state)
        this.props
        .dispatch(commentPost(this.props.post.id,this.state.commentBody))
        .then((data) =>{
            this.setState({commentBody:""})
        })
        // .finally(()=>{
        //     this.setState({likeActionloading:false})
        // })
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            // console.log(error)
        })
    }

    // button afficher plus
    handleMoreOption = e=>{
        this.current.style.display = (!this.state.moreOption) ? 'grid' : 'none'
        this.setState({moreOption: !this.state.moreOption})
    }

    handleDeleteComment = e =>{
        e.preventDefault() ;
        console.log("commentaire supprimé")
        let commentId = e.target.attributes.getNamedItem('data-commentId').value
        this.button.disabled = true;
        this.props
        .dispatch(deleteComment(commentId,this.props.post.id))
        .then((data) =>{
            this.button.disabled = true;
            let new_array_comment = this.state.comments.filter(comment=>{
                return comment.id != commentId
            })
            this.setState({comments:new_array_comment})
            
        })
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            // console.log(error)
        })
    }

    // supprimer un post
    handleDeletePost = e =>{
        e.preventDefault()
        this.button.disabled = true;
        this.setState({handleDeleteCurrentPost:true})
        this.props
        .dispatch(deleteCurrentPost(this.props.post.id))
        .then((data) =>{
            this.button.disabled = false;
            this.setState({handleDeleteCurrentPost:false})
            window.location.reload();
        })
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            // console.log(error)
        })
    }

    // report a post
    handleReportPost = e =>{
        e.preventDefault()
        this.button.disabled = true;
        this.setState({handleReportCurrentPost:true})
        this.props
        .dispatch(reportCurrentPost(this.props.post.id))
        .then((data) =>{
            this.button.disabled = false;
            this.setState({handleReportCurrentPost:false})
        })
        .finally(()=>this.button.disabled = false)
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            // console.log(error)
        })
    }

    getUserLikes(userLikes){
        let likes =  JSON.parse(userLikes)
        return likes.length ;
    }

    getUserComment(comments){
        return comments.length ;
    }

    userLikeOrUnLikePost = e =>{
        let userLikes = this.props.post.usersLikes ;
        let likes =  JSON.parse(userLikes) ;
        let option = (likes.includes(this.props.user.id)) ? -1 : 1 ;
        this.props
        .dispatch(likeOrUnLikePost(this.props.post.id,option))
        .then(response =>{
            // console.log(response)
            this.setState({
                userAlreadyLiked: this.alreadyLiked
            })
        })
        .finally(()=>{
            this.setState({likeActionloading:false})
        })
        .catch((error) => {
            if (error && error.response && error.response.status === 401) {
                eventBus.dispatch("logout");
            }
            // console.log(error)
        })
    }

    alreadyLiked =()=>{
        let likes = JSON.parse(this.props.post.usersLikes) ;
        return likes.includes(this.props.user.id) ;
    }


    render() {
        const {post,index,user} = this.props ;
        const {commentBody,likeActionloading} = this.state ;
        
        return (
            <article key={index}>
                    {/* entete article */}
                    <header>
                        <div>
                            <a>
                                <img
                                    src={ post.author.profile_picture ? `${API_URL}${post.author.profile_picture}` : anonymuser}  />
                            </a>
                        </div>
                        <div className="text">
                            <p className="name">
                                <Link to={`/user/profile/${post.author.id}`} >{post.author.username}</Link>
                            </p>
                            <p className="date"> Publié le {moment(post.createdAt).format("DD-MM-YYYY")} à {moment(post.createdAt).format("HH:mm")} </p>
                        </div>
                        <div className="more-option">
                            <span  onClick={this.handleMoreOption} aria-label="Supprimer la publication"><i className="fas fa-ellipsis-v"></i></span>
                            <div ref={(current)=>this.current=current}  className={`more-option-list`}>
                                <button type="button" ref={(button)=>this.button=button} onClick={this.handleReportPost}> <i class="fas fa-comment-slash"></i> Signaler</button>
                                {(post.author.id==user.id || user.isAdmin) && (
                                    <button type="button" ref={(button)=>this.button=button} onClick={this.handleDeletePost} > <i className="fas fa-trash"></i> Supprimer</button>
                                )}
                            </div>
                        </div>
                    </header>
                    <main>
                        <div className="picture">
                            <img src={`${API_URL}${post.picture}`}  />
                        </div>
                        <div className="content">
                            <p> {post.content} </p>
                        </div>
                    </main>
                    <footer >
                        {/* likes actions */}
                        <div className="comments--likes">
                            <div className="likes--left">
                                <button disabled={likeActionloading} onClick={this.userLikeOrUnLikePost} className={ this.alreadyLiked() ? 'alreadyLiked' : ''} aria-label="aimer la publication">
                                    <i class="fas fa-thumbs-up"></i>  {this.getUserLikes(post.usersLikes)}
                                </button>
                            </div>
                            <div className="comments--right"><span>{this.getUserComment(post.comments)} comment(s)</span></div>
                        </div>
                        <div className="comments" >
                            <h3>Commentaires</h3>
                            {post.comments.map((comment,index)=>(
                            <div className="comments--comment">
                                        <div>
                                            <img 
                                                src={comment.author.profile_picture ? `${API_URL}${comment.author.profile_picture }` : anonymuser} 
                                                ref={img => this.img = img} onError={ () => this.img.src = anonymuser} 
                                            />
                                        </div>
                                        <div className="comments--comment--fluid">
                                            <p class="title">
                                                <Link 
                                                    to={`/user/profile/${comment.author.id}`}
                                                ><span>{comment.author.username}</span></Link> &nbsp;&nbsp;
                                                {moment(comment.createdAt).format("DD-MM-YYYY")} à {moment(comment.createdAt).format("HH:mm")}
                                            </p>
                                            <p>{comment.content}</p>
                                        </div>
                                        {
                                            (comment.author.id==user.id) && (
                                                <form data-commentId={comment.id} className="comments--comment--delete" onSubmit={this.handleDeleteComment}>
                                                    <input type="hidden" name="PostId" />
                                                    <button ref={(button) => this.button=button}  data-commentId={comment.id} type="submit" aria-label="Supprimer le commentaire"><i class="fas fa-trash"></i></button>
                                                </form>
                                            )
                                        }
                            
                            </div>
                        ))}
                            {/* user add new comments */}
                            <form className="comments--add" onSubmit={this.savePostComment}>
                                <img src={ user.profile_picture ? `${API_URL}${user.profile_picture}` : anonymuser} alt="Votre photo de profil" />
                                <label className="hidden">Votre commentaire</label>
                                <input type="text" onChange={this.handleChange} name="commentBody" value={commentBody} placeholder="Votre commentaire" />
                                {/* <button type="submit" aria-label="Envoyer"><i class="fas fa-plus-circle"></i></button> */}
                            </form>
                        </div>
                    </footer>
                </article>
        )
    }
}


export default PostItem ;
