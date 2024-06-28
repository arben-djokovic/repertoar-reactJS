import React from 'react'
import api from '../../api/apiCalls'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../Login/Login"

export default function Singup() {

  let navigate = useNavigate();

  const submitForm = async(e) => {
    e.preventDefault()
    let username = e.target.username.value
    let password = e.target.password.value 
      try{
        const response = await api.post("/users/singup", {
          username: username,
          password: password
        })
        if(response.data.acknowledged === true){
          toast.dismiss()
          toast.success("Napravili ste profil, prijavite se")
            navigate("/log-in")
          }else{
            toast.dismiss()
            toast.error(response.data.message)
          }
       
      }catch(err){
        toast.dismiss()
        toast.error("Doslo je do gresko, pokusajte ponovo")
        console.log(err)
      }
  }
  return (<div className='login'>
    <form onSubmit={submitForm}>
      <h1>Sing up</h1>
      <div className='inputDiv'>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder='username' name="example@gmail.com" id='username' />
      </div>
      <div className='inputDiv'>
        <label htmlFor="password">Password</label>
        <input type="password" placeholder='*******' name="password" id='password' />
      </div>
      <button>Sing up</button>
      <a href="/log-in">Have an account? Log in!</a>
    </form>
    </div>)
}
