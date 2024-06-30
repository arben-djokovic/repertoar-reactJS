import React, { useEffect, useRef, useState } from 'react'
import api from '../api/apiCalls'
import './CreatePlaylist/CreatePlaylist.scss'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function AddSong() {
    const [artists, setArtists] = useState([])
    const [genres, setGenres] = useState([])
    const textAreaRef = useRef()
    const songNameRef = useRef()
    const artistRef = useRef()
    const genreRef = useRef()
    const navigate = useNavigate()

    const getArtists = async() => {
        try{
            const resposne = await api.get("/artists/")
            setArtists(resposne.data)
        }catch(err){
            console.log(err)
        }
    }
    const getGenres = async() => {
        try{
            const resposne = await api.get("/genres/")
            setGenres(resposne.data)
        }catch(err){
            console.log(err)
        }
    }

    const addSong = async(e) => {
        e.preventDefault()
        toast.dismiss()
        if(songNameRef.current.value.length < 2){
            toast.error("Naziv pjesme mora sadrzati minimum 2 karaktera")
            return;
        }
        if(textAreaRef.current.value.length < 2){
            toast.error("Tekst pjesme mora sadrzati minimum 2 karaktera")   
            return;
        }
        try{
            const result = await api.post("/songs/add", {
                name: songNameRef.current.value,
                text: textAreaRef.current.value,
                artist_id: artistRef.current.value,
                genre_id: genreRef.current.value
            })
            console.log(result)
            toast.success("Pjesma uspjesno dodana")
            navigate("/songs/"+result.data.insertedId)
        }catch(err) {
            console.log(err)
            toast.error("Neuspjesno dodavanje pjesme")
        }
    }
    useEffect(()=>{
        getArtists()
        getGenres()
    },[])
  return (
    
    <div className='create-playlist'>
        <form>
            <div className="inputDiv">
                <p>Naziv pjesme</p>
                <input ref={songNameRef} type="text" name='song-name' />
            </div>
            <div className="inputDiv">
                <p>Tekst pjesme</p>
                <textarea ref={textAreaRef} name="song-text" id="song-text" rows={5}></textarea>
            </div>
            <div className="inputDiv">
                <p>Artist</p>
                <select ref={artistRef} name="artist" id="artist">
                    <option value=""></option>
                    {artists.map((artist)=>{
                        return <option key={artist._id} value={artist._id}>{artist.name}</option>
                    })}
                </select>
            </div>
            <div className="inputDiv">
                <p>Genre</p>
                <select ref={genreRef} name="genre" id="genre">
                    <option value=""></option>
                    {genres.map((genre)=>{
                        return <option key={genre._id} value={genre._id}>{genre.name}</option>
                    })}
                </select>
            </div>
            <button onClick={addSong}>Add Song</button>
        </form>
    </div>
  )
}
