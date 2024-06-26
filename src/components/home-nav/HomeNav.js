import React, { useState } from 'react'
import './HomeNav.scss'
import {auth} from '../../services/AuthService'

export default function HomeNav() {
  const isLogged = auth.getAuthStatus()
  return (
    <nav className='homeNav'>
        <ul>
            <li><a href="/">All Songs</a></li>
            <li><a href="/playlists">All Playlists</a></li>
            {isLogged && <li><a href="/my-playlists">My Playlists</a></li>}
        </ul>
    </nav>
  )
}
