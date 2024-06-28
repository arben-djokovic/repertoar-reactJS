import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/apiCalls'

export default function Playlist() {
    const navigate = useNavigate()
    const {id} = useParams()
    let [playlist, setPlaylist] = useState({name: "loading..."})


    const getPlaylist = async() => {
        try{
            const response = await api.get("/playlists/"+id)
            console.log(response)
            setPlaylist(response.data)
        }catch(err){
            toast.error(err.response.data.message)
            console.log(err)
            navigate("/")
        }
    }
    useEffect(()=>{
        getPlaylist()
    },[])
  return (
    <div>
        <h1 className='naslov'>{playlist.name}</h1>
        {}
    </div>
  )
}
