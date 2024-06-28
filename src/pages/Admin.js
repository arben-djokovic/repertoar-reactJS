import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  
    useEffect(()=>{
    },[])
    
  return (
    <div>
      <section style={{display: 'flex', flexDirection: 'column', gridGap: '20px', margin: '20px', alignItems: 'start'}}>
          <button onClick={()=>{navigate("/create-playlist")}}>+ CREATE PLAYLIST</button>
          <button onClick={()=>{navigate("/add-song")}}>+ ADD SONG</button>
          <button onClick={()=>{navigate("/add-artist")}}>+ ADD ARTIST</button>
          <button onClick={()=>{navigate("/add-genre")}}>+ ADD GENRE</button>
      </section>
    </div>
  )
}
