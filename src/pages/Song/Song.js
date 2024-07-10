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
    var listaAkorda = ["C","C#","D","D#","E","F","F#","G","G#","A","B","H"]
    var listaAkordaSaM = ["Cm","C#m","Dm","D#m","Em","Fm","F#m","Gm","G#m","Am","Bm","Hm"]
    var listaSedamM = ["Cm7","C#m7","Dm7","D#m7","Em7","Fm7","F#m7","Gm7","G#m7","Am7","Bm7","Hm7"]
    var listaSedam = ["C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","B7","H7"]
    var listaAkordaSus2 = ["Csus2","C#sus2","Dsus2","D#sus2","Esus2","Fsus2","F#sus2","Gsus2","G#sus2","Asus2","Bsus2","Hsus2"]
    var listaAkordaSus4 = ["Csus4","C#sus4","Dsus4","D#sus4","Esus4","Fsus4","F#sus4","Gsus4","G#sus4","Asus4","Bsus4","Hsus4"]
    
    
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

    const smanjiStepen = () => {
      let songTextEdited = song.text2
      song.text2.forEach((element, i) => {
        let newElement = element
        if(i%2!==1){
          songTextEdited[i]  = ''
          if(!/^\s*$/.test(element)){
            let row = element.split(" ")


            listaSedamM.forEach((akordSa7M, i2) => {
              if(row.includes(akordSa7M)){
                if(i2 == 0){
                  newElement = newElement.replace(akordSa7M, listaSedamM[listaSedamM.length-1])
                }else{
                  newElement = newElement.replace(akordSa7M, listaSedamM[i2-1])
                }
              }
            });
            
            listaAkordaSaM.forEach((akordSaM, i2) => {
              if(row.includes(akordSaM)){
                if(i2 == 0){
                  newElement = newElement.replace(akordSaM, listaAkordaSaM[listaAkordaSaM.length-1])
                }else{
                  newElement = newElement.replace(akordSaM, listaAkordaSaM[i2-1])
                }
              }
            });

            listaSedam.forEach((akordSa7, i2) => {
              if(row.includes(akordSa7)){
                if(i2 == 0){
                  newElement = newElement.replace(akordSa7, listaSedam[listaSedam.length-1])
                }else{
                  newElement = newElement.replace(akordSa7, listaSedam[i2-1])
                }
              }
            });

            listaAkordaSus2.forEach((akordSaSus2, i2) => {
              if(row.includes(akordSaSus2)){
                if(i2 == 0){
                  newElement = newElement.replace(akordSaSus2, listaAkordaSus2[listaAkordaSus2.length-1])
                }else{
                  newElement = newElement.replace(akordSaSus2, listaAkordaSus2[i2-1])
                }
              }
            });

            listaAkordaSus4.forEach((akordSaSus4, i2) => {
              if(row.includes(akordSaSus4)){
                if(i2 == 0){
                  newElement = newElement.replace(akordSaSus4, listaAkordaSus4[listaAkordaSus4.length-1])
                }else{
                  newElement = newElement.replace(akordSaSus4, listaAkordaSus4[i2-1])
                }
              }
            });

            listaAkorda.forEach((akordClassic, i2) => {
              if(row.includes(akordClassic)){
                if(i2 == 0){
                  newElement = newElement.replace(akordClassic, listaAkorda[listaAkorda.length-1])
                }else{
                  newElement = newElement.replace(akordClassic, listaAkorda[i2-1])
                }
              }
            });
          }
          songTextEdited[i] = newElement
        }else{
          songTextEdited[i] = element
        }
      })
      setSong({...song, text2: songTextEdited})
    }
    const povecajStepen = () => {
      let songTextEdited = song.text2
      song.text2.forEach((element, i) => {
        let newElement = element
        if(i%2!==1){
          songTextEdited[i]  = ''
          if(!/^\s*$/.test(element)){
            let row = element.split(" ")


            listaSedamM.forEach((akordSa7M, i2) => {
              if(row.includes(akordSa7M)){
                if(i2 == listaSedamM.length-1){
                  newElement = newElement.replace(akordSa7M, listaSedamM[0])
                }else{
                  newElement = newElement.replace(akordSa7M, listaSedamM[i2+1])
                }
              }
            });
            
            listaAkordaSaM.forEach((akordSaM, i2) => {
              if(row.includes(akordSaM)){
                if(i2 == listaSedamM.length-1){
                  newElement = newElement.replace(akordSaM, listaAkordaSaM[0])
                }else{
                  newElement = newElement.replace(akordSaM, listaAkordaSaM[i2+1])
                }
              }
            });

            listaSedam.forEach((akordSa7, i2) => {
              if(row.includes(akordSa7)){
                if(i2 == listaSedamM.length-1){
                  newElement = newElement.replace(akordSa7, listaSedam[0])
                }else{
                  newElement = newElement.replace(akordSa7, listaSedam[i2+1])
                }
              }
            });

            listaAkordaSus2.forEach((akordSaSus2, i2) => {
              if(row.includes(akordSaSus2)){
                if(i2 == listaSedamM.length-1){
                  newElement = newElement.replace(akordSaSus2, listaAkordaSus2[0])
                }else{
                  newElement = newElement.replace(akordSaSus2, listaAkordaSus2[i2+1])
                }
              }
            });

            listaAkordaSus4.forEach((akordSaSus4, i2) => {
              if(row.includes(akordSaSus4)){
                if(i2 == listaSedamM.length-1){
                  newElement = newElement.replace(akordSaSus4, listaAkordaSus4[0])
                }else{
                  newElement = newElement.replace(akordSaSus4, listaAkordaSus4[i2+1])
                }
              }
            });

            listaAkorda.forEach((akordClassic, i2) => {
              if(row.includes(akordClassic)){
                if(i2 == listaSedamM.length-1){
                  newElement = newElement.replace(akordClassic, listaAkorda[0])
                }else{
                  newElement = newElement.replace(akordClassic, listaAkorda[i2+1])
                }
              }
            });
          }
          songTextEdited[i] = newElement
        }else{
          songTextEdited[i] = element
        }
      })
      setSong({...song, text2: songTextEdited})
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
              <button onClick={smanjiStepen}>Smanji za 1</button>
              <button onClick={povecajStepen}>Povecaj za 1</button>
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
