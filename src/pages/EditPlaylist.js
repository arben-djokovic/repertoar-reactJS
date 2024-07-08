import React, { useEffect, useState } from 'react'
import './CreatePlaylist/CreatePlaylist.scss'
import api from '../api/apiCalls'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

export default function EditPlaylist() {
    const {id} = useParams()
    let [playlistName, setPlaylistName] = useState("")

    const getPlaylistName = async() => {
        try{
            const response = await api.get('playlists/'+id)
            setPlaylistName(response.data.name)
        }catch(err){
            console.log(err)
        }
    }

    const editPlaylist = async(e) => {
        e.preventDefault()
        if(playlistName.length < 2){
            toast.error("Naziv playliste mora sadrzati minimum 2 karaktera")
            return;
        }
        try{
            const respone = await api.patch("/playlists/"+id, {
               name: playlistName 
            })
            toast.success("Playlista izmijenjena")
            console.log(respone)
        }catch(err){
            toast.error("Neuspjesno kreiranje playliste")
            console.log(err)
        }
    }

    useEffect(()=>{
        getPlaylistName()
    },[])
  return (
    <div className='create-playlist'>
        <form>
            <div className="inputDiv">
                <p>Playlist name</p>
                <input onChange={(e)=>{setPlaylistName(e.target.value)}} value={playlistName} type="text" name='naziv-playliste' />
            </div>
            <button onClick={editPlaylist}>Edit Playlist</button>
        </form>
    </div>
  )
}
