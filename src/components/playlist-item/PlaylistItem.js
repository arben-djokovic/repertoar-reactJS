import React from "react";
import "../song-item/SongItem.scss";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { toast } from "react-toastify";
import api from "../../api/apiCalls";
import { auth } from "../../services/AuthService";

export default function PlaylistItem({ playlist }) {
  const navigate = useNavigate();
  const isAdmin = auth.getAuthAdminStatus();

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
  return (
    <li
      className="song-item"
      onClick={() => {
        navigate("/playlists/" + playlist._id);
      }}
    >
      <div>
        <h3>{playlist.name}</h3>
      </div>
        <Dropdown>
           {isAdmin && <li onClick={()=>{navigate("/edit-playlist/"+playlist._id)}}>Edit</li>}
           {isAdmin && <li onClick={(e)=>deletePlaylist(e, playlist._id)}>Delete</li>}
           </Dropdown>
    </li>
  );
}
