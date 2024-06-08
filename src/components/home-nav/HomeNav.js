import React from 'react'
import './HomeNav.scss'

export default function HomeNav() {
  return (
    <nav className='homeNav'>
        <ul>
            <li><a href="/">All Songs</a></li>
            <li><a href="/playlists">All Playlists</a></li>
            <li><a href="/my-playlists">My Playlists</a></li>
        </ul>
    </nav>
  )
}
