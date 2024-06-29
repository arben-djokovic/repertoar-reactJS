import React from "react";
import "./SongItem.scss";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { toast } from "react-toastify";
import api from "../../api/apiCalls";
import { auth } from "../../services/AuthService";

export default function SongItem({ song, isAdmin }) {
  const navigate = useNavigate();

  const deleteSong = async(id) => {
    const confrim =  window.confirm("Are you sure you want to delete this song?");
    if (confrim) {
      try{
        const response = await api.delete(`/songs/${id}`)
        if(response.status == 200){
          toast.success("Song deleted successfully")
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
        navigate("/songs/" + song._id);
      }}
    >
      <div>
        <h3>{song.title}</h3>
        <p>{song.artist.name ? song.artist.name : "Nepoznato"}</p>
      </div>
        <Dropdown>
           {isAdmin && <li onClick={()=>{navigate("/edit-song/"+song._id)}}>Edit</li>}
           {isAdmin && <li onClick={()=>deleteSong(song._id)}>Delete</li>}
           </Dropdown>
    </li>
  );
}
