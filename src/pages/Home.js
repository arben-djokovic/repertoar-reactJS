import React, { useEffect, useState } from 'react'
import api from '../api/apiCalls'

export default function Home() {
    let [songs, setSongs] = useState([])
    const getSongs = async() => {
        try{
            const response =  await api.get("/song")
            setSongs(response.data)
        }catch(err){

        }
    }
    useEffect(()=>{
        getSongs()
    },[])
  return (
    <div>
        <h1>Songs</h1>
        <ul>
            {songs.map(song => {
                return(<li>{song.text}</li>)
            })}
        </ul>
    </div>
  )
}
