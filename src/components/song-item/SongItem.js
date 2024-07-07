import React, { useEffect, useState } from "react";
import "./SongItem.scss";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { toast } from "react-toastify";
import api from "../../api/apiCalls";
import { auth } from "../../services/AuthService";
import Modal from "../Modal/Modal";

export default function SongItem({ song, isAdmin, isLogged, editBtn, deleteBtn, addToPlaylistBtn}) {
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
    setTimeout(() => {
      console.log(checkedPlaylists);
    }, 500);
  };

  const getPlaylists = async() => {
    if(isAdmin && isLogged){
        try{
          const response =  await api.get('/playlists/')
          setPlaylists(response.data)
          console.log(response.data)
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
          console.log(response.data)
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
          console.log(response)
          if(response.data.acknowledged == true){
            toast.success("Song added to " + i+1  +" playlist successfully")
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

  useEffect(()=>{
    getPlaylists()
},[])

  return (
    <>
      <li
        className="song-item"
        onClick={() => {
          navigate("/songs/" + song._id);
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
        </Dropdown>}
        {playlistModal && (
          <Modal closeModal={() => setPlaylistModal(false)}>
            <div className="add-to-playlist">
              <h3>Add to playlist</h3>
              <div className="playlists">
                {playlists &&
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
                  })}
              </div>
              <button onClick={addSongToPlaylists}>Add</button>
            </div>
          </Modal>
        )}
      </li>
    </>
  );
}
