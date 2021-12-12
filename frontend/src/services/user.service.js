import axios from "axios";

import { API_URL } from '../constants';
import authHeader from './auth-header';


class UserService{
    getUserProfile() {
            return axios.get(API_URL + 'auth', { headers: authHeader() });
    }
    changePassword(oldPassword,newPassword){
        return axios.put(API_URL + 'auth/changepassword',{oldPassword,newPassword}, { headers: authHeader() });
    }

    updateAboutMe(description){
        return axios.put(API_URL + 'auth/update-description',{description}, { headers: authHeader() });
    }

    getUserBasicInformation(userId){
        return axios.get(API_URL + `auth/basicinfo/${userId}`, { headers: authHeader() });
    }

    postMessage(content,file){
        let formData = new FormData();
        formData.append('image', file);
        formData.append('content', content);
        return axios.put(API_URL + 'posts',formData, { headers: authHeader() });
    }

    deleteAccount(){
        return axios.delete(API_URL + `auth/user`, { headers: authHeader() });
    }
    
    refreshUserLocalData(){
        const user = JSON.parse(localStorage.getItem("GROUPOMANIA_USER"));
        if(!user.token){
            return ;
        }
        return axios
          .get(API_URL + "auth",{ headers: authHeader() })
          .then((response) => {
            if (response.data.token) {
                let newUser = {token:user.token,...response.data}
                localStorage.setItem("GROUPOMANIA_USER", JSON.stringify(newUser));
            }
        });
    }
    uploadPicture(file){
        let formData = new FormData();
        formData.append('image', file);
        return axios.post(API_URL + 'auth/upload-picture',formData, { headers: authHeader() });
    }   
}

export default new UserService()