import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/apiCalls'
import SongItem from '../../components/song-item/SongItem'
import { auth } from '../../services/AuthService'

export default function Playlist() {
    const navigate = useNavigate()
    const {id} = useParams()
    let [playlist, setPlaylist] = useState({name: "loading...", songs: [{title: undefined}]})
    const isAdmin = auth.getAuthAdminStatus()
    const isLogged = auth.getAuthStatus()


    const getPlaylist = async() => {
        try{
            const response = await api.get("/playlists/"+id)
            console.log(response)
            setPlaylist(response.data)
        }catch(err){
            toast.error(err.response.data.message)
            console.log(err)
            // navigate("/")
        }
    }
    useEffect(()=>{
        getPlaylist()
    },[])
  return (
    <div>
        <h1 className='naslov'>{playlist.name}</h1>
        {playlist.songs[0].title != undefined ? playlist.songs.map(song => {
            return <SongItem song={song} isAdmin={isAdmin} isLogged={isLogged} removeFromPlaylist={true}  />
        }): <p className='notFound'>Nije pronadjena nijedna pjesma</p>}
    </div>
  )
}
