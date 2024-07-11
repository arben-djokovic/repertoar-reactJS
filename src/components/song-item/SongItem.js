import React, { useEffect, useState } from "react";
import "./SongItem.scss";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { toast } from "react-toastify";
import api from "../../api/apiCalls";
import { auth } from "../../services/AuthService";
import Modal from "../Modal/Modal";

export default function SongItem({ song, isAdmin, isLogged, editBtn, deleteBtn, addToPlaylistBtn, removeFromPlaylist, playlistId, playlistUserId, isPublic, removeSong}) {
  const navigate = useNavigate();
  const tokenDecoded = auth.getDecodedToken();
  const [playlistModal, setPlaylistModal] = useState(false);
  let [playlists, setPlaylists] = useState([])
  let checkedPlaylists = [];

  const deleteSong = async (e, id) => {
    const confrim = window.confirm(
      "Are you sure you want to delete this song?"
    );
    if (confrim) {
      try {
        const response = await api.delete(`/songs/${id}`);
        if (response.status == 200) {
          e.target.parentElement.parentElement.parentElement.style.display =
            "none";
          toast.success("Song deleted successfully");
        }
      } catch (err) {
        console.log(err);
        if (err.response.status == 401 || err.response.status == 403) {
          auth.logout();
          toast.error(err.response.data.message);
          navigate("/log-in");
        }
      }
    }
  };

  const changeCheckedPlaylists = (e, id) => {
    if (e.target.checked) {
      checkedPlaylists.push(id);
    } else {
      checkedPlaylists = checkedPlaylists.filter((playlist) => playlist != id);
    }
  };

  const getPlaylists = async() => {
    if(isAdmin && isLogged){
        try{
          const response =  await api.get('/playlists/')
          setPlaylists(response.data)
        }catch(err){
          console.log(err)
          if(err.response.status == 401 || err.response.status == 403){
            auth.logout()
            toast.error(err.response.data.message)
            navigate("/log-in")
          }
        }
    }else if(isLogged){
        try{
          const response =  await api.get('/playlists/get-mine')
          setPlaylists(response.data)
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

  const addSongToPlaylists = async() => {
    if(checkedPlaylists.length > 0){
      checkedPlaylists.forEach(async(checkedPlaylist, i) => {
        try{
          const response = await api.post('/playlists/add-song/'+checkedPlaylist, {
            song_id: song._id
          })
          if(response.data.acknowledged == true){
            toast.success("Song added to " + i+1  +" playlist successfully")
            setPlaylistModal(false)
            let playlistEdit = playlists
              playlistEdit.forEach((element, i) => {
                if(element._id == checkedPlaylist){
                  playlistEdit[i].songIds.push(song._id)
                }
              });
              setTimeout(() => {
                setPlaylists(playlistEdit)
              }, 500);
          }
        }catch(err){
          console.log(err)
          if(err.response.status == 401 || err.response.status == 403){
            auth.logout()
            toast.error(err.response.data.message)
            navigate("/log-in")
          }
        }
      })
    }
  }
  const removeSongFromPlaylist = async(e) => {
    if((isPublic == true && isAdmin) || playlistUserId == tokenDecoded._id){
      const confrim =  window.confirm("Are you sure you want to remove this song from playlist?");
      if (confrim) {
        try{
          const response = await api.patch("/playlists/remove-song/"+playlistId, {
            song_id: song._id
          })
          if(response.data.acknowledged == true){
            toast.success("Song removed from playlist successfully")
            e.target.parentElement.parentElement.parentElement.style.display = 'none'
            removeSong(song._id)
          }
        }catch(err){
          console.log(err)
          toast.error("Something went wrong")
        }
      }
    }
  }

  useEffect(()=>{
    getPlaylists()
},[])

  return (
    <>
      <li
        className="song-item"
        onClick={() => {
          if(playlistId){            
            navigate("/playlists/" + playlistId + "/songs/" + song._id);
          }else{
            navigate("/songs/" + song._id);
          }
        }}
      >
        <div>
          <h3>{song.title}</h3>
          <p>{song.artist.name ? song.artist.name : "Nepoznato"}</p>
        </div>
        {isLogged && <Dropdown>
          {editBtn && isAdmin && (
            <li
              onClick={() => {
                navigate("/edit-song/" + song._id);
              }}
            >
              Edit
            </li>
          )}
          {deleteBtn && isAdmin && <li onClick={(e) => deleteSong(e, song._id)}>Delete</li>}
          {addToPlaylistBtn && isLogged && <li
            onClick={() => {
              setPlaylistModal(true);
            }}
          >
            Add to playlist
          </li>}
          {removeFromPlaylist && ((isPublic == true && isAdmin) || playlistUserId == tokenDecoded._id) && <li onClick={removeSongFromPlaylist}>Remove from playlist</li>}
        </Dropdown>}
        {playlistModal && (
          <Modal closeModal={() => setPlaylistModal(false)}>
            <div className="add-to-playlist">
              <h3>Add to playlist</h3>
              <div className="playlists">
                {playlists.length > 0 ?
                  playlists.map((playlist) => {
                    if((playlist.isPublic == true && isAdmin == true) || (playlist.user_id == tokenDecoded._id)){
                      return(
                      <div className="input" key={playlist._id}>
                        <input
                          disabled={playlist.songIds.includes(song._id)}
                          defaultChecked={playlist.songIds.includes(song._id)}
                          onChange={(e) => {
                            changeCheckedPlaylists(e, playlist._id);
                          }}
                          type="checkbox"
                          id={playlist._id}
                        />
                        <label htmlFor={playlist._id}> {playlist.name}</label>
                      </div>)
                    } 
                  }) : "No playlist found"}
              </div>
              {playlists.length > 0 ?<button onClick={addSongToPlaylists}>Add</button> : ""}
            </div>
          </Modal>
        )}
      </li>
    </>
  );
}
