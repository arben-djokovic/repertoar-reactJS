import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/apiCalls'
import SongItem from '../../components/song-item/SongItem'
import { auth } from '../../services/AuthService'
import Dropdown from '../../components/Dropdown/Dropdown'

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

    const deletePlaylist = async(e, id) => {
        const confrim =  window.confirm("Are you sure you want to delete this playlist?");
        if (confrim) {
          try{
            const response = await api.delete(`/playlists/${id}`)
            if(response.status == 200){
              toast.success("Playlist deleted successfully")
              navigate("/my-playlists")
            }
          }catch(err){
            console.log(err)
            if(err.response.status == 401 || err.response.status == 403){
              auth.logout()
              toast.error(err.response.data.message)
              navigate("/log-in")
            }
          }
        }
    
      }

    useEffect(()=>{
        getPlaylist()
    },[])
  return (
    <div>
        <div className='naslov'>
            <h1>{playlist.name}</h1>
            <Dropdown>
                {isAdmin && <li onClick={()=>{navigate("/edit-playlist/"+playlist._id)}}>Edit</li>}
                {isAdmin && <li onClick={(e)=>deletePlaylist(e, playlist._id)}>Delete</li>}
            </Dropdown>
        </div>
        {playlist.songs[0].title != undefined ? playlist.songs.map(song => {
            return <SongItem key={song._id} song={song} isAdmin={isAdmin} isLogged={isLogged} removeFromPlaylist={true}  />
        }): <p className='notFound'>Nije pronadjena nijedna pjesma</p>}
    </div>
  )
}
