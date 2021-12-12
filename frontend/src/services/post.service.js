import axios from "axios";

import { API_URL } from '../constants';
import authHeader from './auth-header';


class PostService{

    postMessage(content,file){
        let formData = new FormData();
        formData.append('image', file);
        formData.append('content', content);
        return axios.post(API_URL + 'posts',formData, { headers: authHeader() });
    }

    deletePost(postId){
        return axios.delete(API_URL + `posts/${postId}`,{ headers: authHeader() });
    }

    reportPost(postId){
        return axios.get(API_URL + `posts/report/${postId}`,{ headers: authHeader() });
    }

    gettAllPosts(){
        return axios.get(API_URL + 'posts', { headers: authHeader() });
    }

    getPostsByUserId(userId){
        return axios.get(API_URL + `posts/byuserId/${userId}`, { headers: authHeader() });
    }

    gettAllReportedPosts(){
        return axios.get(API_URL + 'posts/reported', { headers: authHeader() });
    }

    

    likePost(postId,option){
        return axios.post(API_URL + `posts/like/${postId}`,{option}, { headers: authHeader() });
    }

    commentPost(postId,content){
        return axios.post(API_URL + `comments`,{post_id:postId,content}, { headers: authHeader() });
    }

    deleteComment(commentId){
        return axios.delete(API_URL + `comments/${commentId}`,{ headers: authHeader() });
    }
}

export default new PostService()