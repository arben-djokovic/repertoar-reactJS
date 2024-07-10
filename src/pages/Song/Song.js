import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/apiCalls'
import { auth } from '../../services/AuthService'
import Dropdown from '../../components/Dropdown/Dropdown'
import Modal from '../../components/Modal/Modal'
import "./Song.scss"

export default function Song({inPlaylist}) {
  const navigate = useNavigate()
    const {id} = useParams()
    const {playlistId} = useParams()
    const isAdmin = auth.getAuthAdminStatus()
    const isLogged = auth.getAuthStatus()
    const tokenDecoded = auth.getDecodedToken();
    let [song, setSong] = useState({title: "loading...", artist: {name: "loading..."}, text2: []})
    let [songs, setSongs] = useState([])
    let [playlist, setPlaylist] = useState({})
    let [playlists, setPlaylists] = useState([])
    let [playlistModal, setPlaylistModal] = useState(false);
    let checkedPlaylists = [];


    const getSong = async() => {
        try{
            const response = await api.get("/songs/"+id)
            let songEdit = response.data
            songEdit.text2 = response.data.text.split("\n")
            setSong(response.data)

        }catch(err){
            toast.error(err.response.data.message)
            console.log(err)
        }
    }
    
    const getSongs = async() => {
      try{
          const response = await api.get("/songs/")
          setSongs(response.data)
      }catch(err){
          toast.error(err.response.data.message)
          console.log(err)
      }
  }

    const deleteSong = async (e, id) => {
      const confrim = window.confirm(
        "Are you sure you want to delete this song?"
      );
      if (confrim) {
        try {
          const response = await api.delete(`/songs/${id}`);
          if (response.status == 200) {
            toast.success("Song deleted successfully");
            navigate('/')
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
              let playlistEdit = playlists
              playlistEdit.forEach((element, i) => {
                if(element._id == checkedPlaylist){
                  playlistEdit[i].songIds.push(song._id)
                }
              });
              setTimeout(() => {
                setPlaylists(playlistEdit)
              }, 500);
              setPlaylistModal(false)
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
        checkedPlaylists = []
      }
    }

    const getPlaylist = async() => {
      try{
          const response =  await api.get('/playlists/'+playlistId)
          setPlaylist(response.data)
        }catch(err){
          console.log(err)
          if(err.response.status == 401 || err.response.status == 403){
            auth.logout()
            toast.error(err.response.data.message)
            navigate("/log-in")
          }
        }
    }

    const previousSong = async() => {
      if(inPlaylist){
        let indexOfSong = playlist.songIds.indexOf(id);
        if(indexOfSong == 0){
          navigate("/playlists/"+playlistId+"/songs/"+playlist.songIds[playlist.songIds.length-1])
        }else{
          navigate("/playlists/"+playlistId+"/songs/"+playlist.songIds[indexOfSong-1])
        }
      }else{
        let index = songs.findIndex(function(song) { return song._id === id;});
        if(index == 0){
          navigate("/songs/"+songs[songs.length-1]._id)
        }else{
          navigate("/songs/"+songs[index-1]._id)
        }
      }
    }
    const nextSong = () => {
      if(inPlaylist){
        let indexOfSong = playlist.songIds.indexOf(id);
        if(indexOfSong == playlist.songIds.length-1){
          navigate("/playlists/"+playlistId+"/songs/"+playlist.songIds[0])
        }else{
          navigate("/playlists/"+playlistId+"/songs/"+playlist.songIds[indexOfSong+1])
        }
      }else{
        let index = songs.findIndex(function(song) { return song._id === id;});
        if(index == songs.length-1){
          navigate("/songs/"+songs[0]._id)
        }else{
          navigate("/songs/"+songs[index+1]._id)
        }
      }
    }
    const randomSong = async() => {
      if(!inPlaylist){
        try{
          const response = await api.get('/songs/random')
          navigate("/songs/"+response.data._id)
          getSong()
        }catch(err){
          toast.error("Error while getting previous song")
        }
      }else{
        let indexOfSong = playlist.songIds.indexOf(id);
        let randomIndex = Math.floor(Math.random() * playlist.songs.length);
        while(randomIndex == indexOfSong){
          randomIndex = Math.floor(Math.random() * playlist.songs.length);
        }
        navigate("/playlists/"+playlistId+"/songs/"+playlist.songs[randomIndex]._id)
      }
    }
    useEffect(()=>{
        getSong()
        getPlaylists()
        if(inPlaylist){
          getPlaylist()
        }else{
          getSongs()
        }
    },[id])
  return (
    <div className='songPage'>
        <div className='naslov'>
          <h1>{song.title} <br /> <span style={{fontSize: "17px"}}>{song.artist ? song.artist.name : 'undefined'}</span></h1>
          {isLogged && <Dropdown>
          {isAdmin && (
            <li
              onClick={() => {
                navigate("/edit-song/" + song._id);
              }}
            >
              Edit
            </li>
          )}
          {isAdmin && <li onClick={(e) => deleteSong(e, song._id)}>Delete</li>}
        <li
            onClick={() => {
              setPlaylistModal(true);
            }}
          >
            Add to playlist
          </li>
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
        </div>
        <section className="main">
          <section className="commands">
            <div className="buttons">
              <button>Smanji za 1</button>
              <button>Povecaj za 1</button>
            </div>
          </section>
          <pre className="text">
            {song.text2.map((text, i) => {
                return(<p key={i} style={{ color: i % 2 === 1 ? 'black' : 'red' }}>{text}</p>)
            })}
          </pre>
          <div className="changeSong">
            <button onClick={previousSong}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
            <button onClick={nextSong}><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
            <button onClick={randomSong}>Random <i className="fa fa-random" aria-hidden="true"></i></button>
          </div>
        </section>
    </div>
  )
}
