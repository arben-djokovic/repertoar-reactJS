
import api from '../api/apiCalls'

class AuthService {
  getAuthStatus = () => {
    let token = localStorage.getItem("accessToken");
    if (!!token) this.setJWT(token);
    return !!token;
  };

  setJWT = (token) =>
      (api.defaults.headers.common["24CA04APR02"] = token);

  login = (access, username) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("username", username);
    this.setJWT(access);
  };

  logout = () => localStorage.clear();
}
export const auth = new AuthService();