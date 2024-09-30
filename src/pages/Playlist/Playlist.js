import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/apiCalls'
import SongItem from '../../components/song-item/SongItem'
import { auth } from '../../services/AuthService'
import Dropdown from '../../components/Dropdown/Dropdown'
import Modal from '../../components/Modal/Modal'
import "./Playlist.scss"

export default function Playlist() {
    const navigate = useNavigate()
    const {id} = useParams()
    let [playlist, setPlaylist] = useState({name: "loading...", songs: [{title: undefined}], songIds: []})
    let [isModalOpen, setIsModalOpen] = useState(false)
    let [songs, setSongs] = useState([])
    const isAdmin = auth.getAuthAdminStatus()
    const isLogged = auth.getAuthStatus()
    const tokenDecoded = auth.getDecodedToken();
    let checkedSongs = []


    const getPlaylist = async() => {
        try{
            const response = await api.get("/playlists/"+id)
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
      const getSongs = async() => {
        try{
            const response = await api.get("/songs/")
            setSongs(response.data.result)
        }catch(err){
            console.log(err)
            if(err.response.status == 401 || err.response.status == 403){
              auth.logout()
              toast.error(err.response.data.message)
              navigate("/log-in")
            }
        }
      }

      const addSongsToPlaylists = async() => {
        if(checkedSongs.length == 0){
          toast.error("Please select at least one song")
          return
        }

        checkedSongs.forEach(async (song, i) => {
          try{
            const response = await api.post("/playlists/add-song/"+playlist._id, {song_id: song})
            if(response.data.acknowledged == true){
              toast.success( i+1 +". song added to playlist successfully")
            }
          }catch(err){
            if(err.response.status == 401 || err.response.status == 403){
              auth.logout()
              toast.error(err.response.data.message)
              navigate("/log-in")
            }
            console.log(err)
          }
        });

        setTimeout(() => {
          getPlaylist()
        }, 500);
      }
      const changeCheckedSongs = (e, id) => {
        if (e.target.checked) {
          checkedSongs.push(id);
        } else {
          checkedSongs = checkedSongs.filter((song) => song != id);
        }
      }

      const removeSong = (id) => {
        getPlaylist()
      }

    useEffect(()=>{
        getPlaylist()
        setTimeout(() => {
          getSongs()
        }, 500);
    },[])
  return (
    <div className='playlist'>
        <div className='naslov'>
            <h1>{playlist.name}</h1>
            {isLogged && <Dropdown>
              {(isAdmin || playlist.user_id == tokenDecoded._id)  && <li onClick={(e)=>setIsModalOpen(true)}>Add Songs To Playlist</li>}
                {(isAdmin || playlist.user_id == tokenDecoded._id)  && <li onClick={()=>{navigate("/edit-playlist/"+playlist._id)}}>Edit</li>}
                {(isAdmin || playlist.user_id == tokenDecoded._id)  && <li onClick={(e)=>deletePlaylist(e, playlist._id)}>Delete</li>}
            </Dropdown>}
        </div>
        {playlist.songs[0].title != undefined ? playlist.songs.map(song => {
            return <SongItem key={song._id} song={song} isAdmin={isAdmin} isLogged={isLogged} removeFromPlaylist={true} playlistId={playlist._id} playlistUserId={playlist.user_id} isPublic={playlist.isPublic} removeSong={removeSong} />
        }): <p className='notFound'>Nije pronadjena nijedna pjesma</p>}

        {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)}>
        <div className="add-to-playlist">
              <h3>Add songs to playlist</h3>
              <div className="playlists">
                {songs.length > 0 ?
                  songs.map((song) => {
                      return(
                      <div className="input" key={song._id}>
                        <input
                          disabled={playlist.songIds.includes(song._id)}
                          defaultChecked={playlist.songIds.includes(song._id)}
                          onChange={(e) => {
                            changeCheckedSongs(e, song._id);
                          }}
                          type="checkbox"
                          id={song._id}
                        />
                        <label htmlFor={song._id}> {song.title}</label>
                      </div>)
                  }) : "No song found"}
              </div>
              {songs.length > 0 ?<button onClick={addSongsToPlaylists}>Add</button> : ""}
            </div>
          </Modal>}
    </div>
  )
}
