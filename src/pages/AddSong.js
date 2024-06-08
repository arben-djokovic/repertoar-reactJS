import React, { useEffect, useState } from 'react'
import api from '../api/apiCalls'

export default function AddSong() {
    const [artists, setArtists] = useState([])

    const getArtists = async() => {
        try{
            const resposne = await api.get("/artist/")
            setArtists(resposne.data)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        getArtists()
    },[])
  return (
    <div>
        <select name="artist" id="artist">
            {artists.map(artist => {
                return(<option value={artist._id}>{artist.name}</option>)
            })}
        </select>
    </div>
  )
}
