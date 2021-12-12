import axios from "axios";

import {API_URL} from "../constants"



class AuthService {
    login(email, password){
        return axios.post(API_URL + "auth/login", { email, password })
    }
    
    logout() {
        localStorage.removeItem("GROUPOMANIA_USER");
    }
    
    register(username, email, password) {
        return axios.post(API_URL + "auth/register", {
          username,
          email,
          password,
        });
    }
}
  
export default new AuthService();
