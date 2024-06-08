import React from 'react'
import api from '../api/apiCalls'
import { auth } from '../services/AuthService'
import { useNavigate } from 'react-router-dom';

export default function Login() {

  let navigate = useNavigate();

  const submitForm = async(e) => {
    e.preventDefault()
    let username = e.target.username.value
    let password = e.target.password.value
      try{
        const response = await api.post("/user/login", {
          username: username,
          password: password
        })
        if(response.statusText == "OK"){
          auth.login(response.data.token, username)
          navigate("/")
       }
      }catch(err){
        console.log(err)
      }
  }
  return (<div>
    <form onSubmit={submitForm}>
      <input type="text" placeholder='username' name="username" /><br /><br />
      <input type="password" placeholder='password' name="password" /><br /><br />
      <button>Submit</button>
    </form>
    </div>)
}
