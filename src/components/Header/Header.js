import React, { useEffect, useState } from 'react'
import "./Style.scss"
import { auth } from '../../services/AuthService'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  let [isAdmin, setIsAdmin] = useState(auth.getAuthAdminStatus()) 
  let [isLogged, setIsLogged] = useState(auth.getAuthStatus()) 
  const location = useLocation()
  const navigate = useNavigate()

  let getAuth = () => {
    setIsAdmin(auth.getAuthAdminStatus()) 
    setIsLogged(auth.getAuthStatus()) 
  }
  useEffect(()=>{
    document.querySelector(".nav").classList.remove("visible");
    getAuth()
  },[location])
  const tooggleNav = () => {
    document.querySelector(".nav").classList.toggle("visible");
  }

  return (<header className='header'>
    <a href="/"><h1>Repertoar</h1></a>
    <i onClick={tooggleNav} className="fa fa-bars" aria-hidden="true"></i>
    <nav className='nav'> 
    <i  onClick={tooggleNav} className="fa fa-times" aria-hidden="true"></i>
      <a href="/">Home</a>
      {isAdmin && <a href="/admin">Admin</a>}
      {isLogged && <a href="/me">Profile</a>}
      {!isLogged && <a href="/log-in"><button>Log in</button></a>}
      {isLogged && <button onClick={()=>{localStorage.clear(); navigate("/")}}>Log out</button>}
    </nav>
  </header>
  )
}
