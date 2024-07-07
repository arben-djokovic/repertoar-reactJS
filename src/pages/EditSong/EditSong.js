import React, { useEffect, useRef, useState } from 'react'
import api from '../../api/apiCalls'
import '.././CreatePlaylist/CreatePlaylist.scss'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddSong() {
    const [artists, setArtists] = useState([])
    const [genres, setGenres] = useState([])
    const [textArea, setTextArea] = useState('')
    const [songName, setSongName] = useState('')
    const [artist, setArtist] = useState('')
    const [genre, setGenre] = useState('')
    const {id} = useParams()
    const navigate = useNavigate()

    const getSong = async() => {
        try{
            const response = await api.get('/songs/'+id)
            console.log(response.data)
            setSongName(response.data.title)
            setArtist(response.data.artist_id)
            setGenre(response.data.genre_id)
            setTextArea(response.data.text)
        }catch(err){
            console.log(err)
        }
    }

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

    const editong = async(e) => {
        e.preventDefault()
        toast.dismiss()
        if(songName.length < 1){
            toast.error("Naziv pjesme mora sadrzati minimum 1 karaktera")
            return;
        }
        if(textArea.length < 2){
            toast.error("Tekst pjesme mora sadrzati minimum 2 karaktera")   
            return;
        }
        try{
            const result = await api.patch("/songs/"+id, {
                title: songName,
                text: textArea,
                artist_id: artist,
                genre_id: genre
            })
            console.log(result)
            toast.success("Uspjesno izmijenjena pjesma")
        }catch(err) {
            console.log(err)
            toast.error("Neuspjesno editovanje pjesme")
        }
    }
    useEffect(()=>{
        getArtists()
        getGenres()
        getSong()
    },[])
  return (
    
    <div className='create-playlist'>
        <form>
            <div className="inputDiv">
                <p>Naziv pjesme</p>
                <input value={songName} onChange={(e)=>{setSongName(e.target.value)}} type="text" name='song-name' />
            </div>
            <div className="inputDiv">
                <p>Tekst pjesme</p>
                <textarea value={textArea} onChange={(e)=>{setTextArea(e.target.value)}} name="song-text" id="song-text" rows={5}></textarea>
            </div>
            <div className="inputDiv">
                <p>Artist</p>
                <select value={artist} onChange={(e)=>{setArtist(e.target.value)}} name="artist" id="artist">
                    <option value=""></option>
                    {artists.map((artist)=>{
                        return <option key={artist._id} value={artist._id}>{artist.name}</option>
                    })}
                </select>
            </div>
            <div className="inputDiv">
                <p>Genre</p>
                <select value={genre} onChange={(e)=>{setGenre(e.target.value)}} name="genre" id="genre">
                    <option value=""></option>
                    {genres.map((genre)=>{
                        return <option key={genre._id} value={genre._id}>{genre.name}</option>
                    })}
                </select>
            </div>
            <button onClick={editong}>Edit Song</button>
        </form>
    </div>
  )
}
