import React, { useEffect, useState } from 'react'
import api from '../../api/apiCalls'
import { useLocation, useNavigate } from 'react-router-dom';
import HomeNav from '../../components/home-nav/HomeNav';
import './Home.scss'
import SongItem from '../../components/song-item/SongItem';
import { auth } from '../../services/AuthService';
import { toast } from 'react-toastify';

export default function Home() {
    let [songs, setSongs] = useState([])
    let [genres, setGenres] = useState([])
    let [playlists, setPlaylists] = useState([])
    const location = useLocation();
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    const genre = queryParams.get('genre');
    let isAdmin = auth.getAuthAdminStatus()
    let isLogged = auth.getAuthStatus()

    const getSongs = async() => {
        let apiCall = '/songs/'
        let added = false;
        if(search && search.length > 0){
            added = true
            apiCall += "?search="+search
        }
        if(genre && genre != 0 && genre.length > 0){
            if(added == false){
                added = true
                apiCall += "?genre="+genre
            }else{
                apiCall += "&genre="+genre
            }
        }
        try{
            const response =  await api.get(apiCall)
            setSongs(response.data)
        }catch(err){

        }
    }

    const getGenres = async() => {
        try{
            const response =  await api.get('/genres/')
            console.log(response)
            setGenres(response.data)
        }catch(err){

        }
    }


    useEffect(()=>{
        getSongs()
        getGenres()
    },[])
  return (
    <div className='home'>
        <HomeNav />
        <section className="page">
            <form className='searchForm' action="" method='GET'>
                <input type="text" name='search' defaultValue={search} placeholder='example: Sve jos mirise na nju' />
                <select name="genre" id="genre">
                    <option value="0">All</option>
                    {genres && genres.map(genreEl => {
                        if(String(genreEl._id) == genre){
                            return <option key={genreEl._id} selected value={genreEl._id}>{genreEl.name}</option>
                        }else{
                            return <option key={genreEl._id} value={genreEl._id}>{genreEl.name}</option>
                        }
                    })}
                </select>
                <button>Search</button>
                <a href="/">Reset</a>
            </form>

            {songs.length ? <ul className='songs'>
                {songs.map(song => {
                    return(
                    <SongItem key={song._id} song={song} isAdmin={isAdmin} isLogged={isLogged} editBtn={true} deleteBtn={true} addToPlaylistBtn={true} />)
                })}
            </ul> : <p className='notFound'>Nije pronadjena nijedna pijesma</p>}
        </section>
    </div>
  )
}
