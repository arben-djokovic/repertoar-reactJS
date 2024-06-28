import React from "react";
import "./SongItem.scss";
import { useNavigate } from "react-router-dom";

export default function SongItem({ song }) {
  const navigate = useNavigate();
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
    </li>
  );
}
