
import api from '../api/apiCalls'
import { jwtDecode } from 'jwt-decode';


class AuthService {
  getAuthStatus = () => {
    let token = localStorage.getItem("token");
    if (!!token) {this.setJWT(token)}else{return false};
    return !!token;
  };
  getAuthAdminStatus = () => {
    let token = localStorage.getItem("token");
    if (!!token) {this.setJWT(token)}else{return false};
    try{
      const decodedToken = jwtDecode(token);
      return decodedToken.isAdmin;
    }catch(err){
      return false
    }
  };
  getDecodedToken = () => {
    let token = localStorage.getItem("token");
    if (!!token) {this.setJWT(token)}else{return false};
    try{
      const decodedToken = jwtDecode(token);
      return decodedToken;
    }catch(err){
      return false
    }
  };

  setJWT = (token) =>
    (api.defaults.headers.common["Authorization"] = `Bearer ${token}`);

  login = (access, username) => {
    localStorage.setItem("token", access);
    localStorage.setItem("username", username);
    this.setJWT(access);
  };

  logout = () => localStorage.clear();
}
export const auth = new AuthService();