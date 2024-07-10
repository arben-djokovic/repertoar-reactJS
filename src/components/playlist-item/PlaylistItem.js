import React from "react";
import "../song-item/SongItem.scss";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { toast } from "react-toastify";
import api from "../../api/apiCalls";
import { auth } from "../../services/AuthService";

export default function PlaylistItem({ playlist, editBtn, deleteBtn, favourites }) {
  const navigate = useNavigate();
  const isAdmin = auth.getAuthAdminStatus();
  const isLogged = auth.getAuthStatus();
  const tokenDecoded = auth.getDecodedToken();

  const deletePlaylist = async(e, id) => {
    const confrim =  window.confirm("Are you sure you want to delete this playlist?");
    if (confrim) {
      try{
        const response = await api.delete(`/playlists/${id}`)
        if(response.status == 200){
          e.target.parentElement.parentElement.parentElement.style.display = 'none'
          toast.success("Playlist deleted successfully")
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
  
  const addToFavorites = async(e) => {
    e.stopPropagation()
    const confrim = window.confirm("Are you sure?")
    if(confrim && !localStorage.getItem("favourites").includes(playlist._id)){
      try{
        const response = await api.post("/playlists/add-to-favourites/"+playlist._id)
        console.log(response)
        localStorage.setItem("favourites", JSON.stringify([...JSON.parse(localStorage.getItem("favourites") || "[]"), playlist._id]))
        e.target.classList.toggle("star-selected");
      }catch(err){
        console.log(err)
      }
    }else if(confrim && localStorage.getItem("favourites").includes(playlist._id)){
      try{
        const response = await api.post("/playlists/remove-from-favourites/"+playlist._id)
        console.log(response)
        localStorage.setItem("favourites", JSON.stringify(JSON.parse(localStorage.getItem("favourites")).filter((id) => id != playlist._id)))
        e.target.classList.toggle("star-selected");
        if(favourites){
          e.target.parentElement.parentElement.style.display = 'none'
        }
      }catch(err){
        console.log(err)
      }
    }
  } 


  return (
    <li
      className="song-item"
      onClick={() => {
        navigate("/playlists/" + playlist._id);
      }}
    >
      <div className="left">
        {isLogged && <i onClick={addToFavorites} className={localStorage.getItem("favourites") && localStorage.getItem("favourites").includes(playlist._id) ? "fa fa-star star-selected" : "fa fa-star"} aria-hidden="true"></i>}
        <h3>{playlist.name}</h3>
      </div>
        {isLogged && <Dropdown>
           {(isAdmin || playlist.user_id == tokenDecoded._id) && editBtn && <li onClick={()=>{navigate("/edit-playlist/"+playlist._id)}}>Edit</li>}
           {(isAdmin || playlist.user_id == tokenDecoded._id)  && deleteBtn && <li onClick={(e)=>deletePlaylist(e, playlist._id)}>Delete</li>}
           </Dropdown>}
    </li>
  );
}
