import React from 'react'
import api from '../../api/apiCalls'
import { auth } from '../../services/AuthService'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./Login.scss"

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
        if(response.statusText === "OK"){
          if(response.data.token){
            auth.login(response.data.token, username)
            navigate("/")
          }else{
            toast.error(response.data.message)
          }
       }
      }catch(err){
        toast.error("Doslo je do gresko, pokusajte ponovo")
        console.log(err)
      }
  }
  return (<div className='login'>
    <form onSubmit={submitForm}>
      <h1>Login</h1>
      <div className='inputDiv'>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder='username' name="example@gmail.com" id='username' />
      </div>
      <div className='inputDiv'>
        <label htmlFor="password">Password</label>
        <input type="password" placeholder='*******' name="password" id='password' />
      </div>
      <button>Log in</button>
    </form>
    </div>)
}
