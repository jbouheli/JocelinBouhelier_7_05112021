import React from 'react'
import { Link,Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import validator from 'validator'

import "./index.scss"

import Layout from '../../layout'
import CreatePostComponent from "../../components/post"
import PostItem from '../../components/postItem';
import { getAllReportedPosts } from '../../actions/posts';

class Report extends React.Component{
    constructor(props){
        super(props) ;
        this.state ={
            postsLoading:false
        }
    }
    componentDidMount(){
        // on fetch tous les posts 
        this.props
        .dispatch(getAllReportedPosts())
        .then((response)=>{
            // console.log(response)
            // this.setState({posts:response})
        })
        .finally(()=>this.setState({postsLoading:false}))
        .catch((error) => {
            // if (error.response && error.response.status === 401) {
            //     eventBus.dispatch("logout");
            // }
            console.log(error)
        })
    }

    
    render(){
        const { isLoggedIn, message, posts, user } = this.props;
        const {postsLoading} = this.state ;
        // console.log(user)

        if (!isLoggedIn) {
          return <Redirect to="/login" />;
        }
        return (
            <Layout>
                <div className="publications">
                    <h1>Liste des publications signalées</h1>
                    {/* LISTE DES DERNIERES PUBLICATIONS  */}
                    <section className="publications--list">
                        {postsLoading ?(
                            <div className="loading-posts">
                                <i class="fa fa-spinner fa-spin"></i> Loading
                            </div>
                        ):(
                            posts.map((post,i)=>(
                                <PostItem  {...this.props} key={i} post={post} index={i} user={user} />
                            ))
                        )}
                    </section>
                </div>
            </Layout>
        )
    }
}


function mapStateToProps(state) {
    const { isLoggedIn, user } = state.auth;
    const { message } = state.message;
    const {reportedPosts:posts} = state.posts ;
    return {
      isLoggedIn,
      message,
      posts,
      user
    };
}
  
export default connect(mapStateToProps)(Report);
