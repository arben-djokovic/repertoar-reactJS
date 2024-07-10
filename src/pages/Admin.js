import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  
    useEffect(()=>{
    },[])
    
  return (
    <div>
      <section style={{display: 'flex', flexDirection: 'column', gridGap: '20px', margin: '20px', alignItems: 'start'}}>
          <div style={{display: 'inline'}}>
            <button style={{margin: '5px'}} onClick={()=>{navigate("/add-song")}}>+ ADD SONG</button>
            <button style={{margin: '5px'}} onClick={()=>{navigate("/create-playlist")}}>+ CREATE PLAYLIST</button>
            <button style={{margin: '5px'}} onClick={()=>{navigate("/add-artist")}}>+ ADD ARTIST</button>
            <button style={{margin: '5px'}} onClick={()=>{navigate("/add-genre")}}>+ ADD GENRE</button>
          </div>
          <div style={{display: 'inline'}}>
            <button style={{backgroundColor: "green", margin: '5px'}} onClick={()=>{navigate("/")}}>Songs</button>
            <button style={{backgroundColor: "green", margin: '5px'}} onClick={()=>{navigate("/playlists")}}>Playlists</button>
            <button style={{backgroundColor: "green", margin: '5px'}} onClick={()=>{navigate("/my-playlists")}}>My playlists</button>
            <button style={{backgroundColor: "green", margin: '5px'}} onClick={()=>{navigate("/artists")}}>Artists</button>
            <button style={{backgroundColor: "green", margin: '5px'}} onClick={()=>{navigate("/genres")}}>Genres</button>
          </div>
      </section>
    </div>
  )
}
