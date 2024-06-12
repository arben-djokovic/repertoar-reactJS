import React, { useState } from 'react'
import './CreatePlaylist.scss'
import api from '../../api/apiCalls'
import { toast } from 'react-toastify'
export default function CreatePlaylist() {

    let [playlistName, setPlaylistName] = useState("")
    const createPlatlist = async(e) => {
        e.preventDefault()
        if(playlistName.length < 2){
            toast.error("Naziv playliste mora sadrzati minimum 2 karaktera")
            return;
        }
        try{
            const respone = await api.post("/playlist/create", {
               name: playlistName 
            })
            if(respone.data.acknowledged == true){
                toast.success("Playlista kreirana")
            }
        }catch(err){
            toast.error("Neuspjesno kreiranje playliste")
            console.log(err)
        }
    }
  return (
    <div className='create-playlist'>
        <form>
            <div className="inputDiv">
                <p>Naziv playliste</p>
                <input onChange={(e)=>{setPlaylistName(e.target.value)}} type="text" name='naziv-playliste' />
            </div>
            <button onClick={createPlatlist}>Create Playlist</button>
        </form>
    </div>
  )
}
