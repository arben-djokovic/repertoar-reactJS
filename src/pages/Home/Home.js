import React, { useEffect, useState } from 'react'
import api from '../../api/apiCalls'
import { useLocation } from 'react-router-dom';
import HomeNav from '../../components/home-nav/HomeNav';
import './Home.scss'

export default function Home() {
    let [songs, setSongs] = useState([])
    let [genres, setGenres] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    const genre = queryParams.get('genre');

    const getSongs = async() => {
        let apiCall = '/song/'
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
            const response =  await api.get('/genre/')
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
                        if(genreEl._id == genre){
                            return <option selected value={genreEl._id}>{genreEl.name}</option>
                        }else{
                            return <option value={genreEl._id}>{genreEl.name}</option>
                        }
                    })}
                </select>
                <button>Search</button>
                <a href="/">Reset</a>
            </form>

            {songs.length ? <ul>
                {songs.map(song => {
                    return(<li>
                        <h3>{song.title}</h3>
                        <p>{song.artist.name ? song.artist.name : "Nepoznato"}</p>
                    </li>)
                })}
            </ul> : <p className='notFound'>Nije pronadjena nijedna pijesma</p>}
        </section>
    </div>
  )
}
