import React, { useEffect, useState } from 'react'
import api from '../../api/apiCalls'
import { useLocation, useNavigate } from 'react-router-dom';
import HomeNav from '../../components/home-nav/HomeNav';
import '../Home/Home.scss'
import PlaylistItem from '../../components/playlist-item/PlaylistItem';
import { auth } from '../../services/AuthService';
import { toast } from 'react-toastify';

export default function FavouritePlaylists() {
    let [playlists, setPlaylists] = useState([])
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');

    const getPlaylists = async() => {
        // let apiCall = '/playlists/'
        // if(search && search.length > 0){
        //     apiCall += "?search="+search
        // }
        try{
            const response =  await api.get("/playlists/my-favourites")
            setPlaylists(response.data[0].playlists)
            localStorage.setItem('favourites', JSON.stringify(response.data[0].playlists))
        }catch(err){
            console.log(err)
            if(err.response.status == 401 || err.response.status == 403 || err.response.status == 400){
                auth.logout()
                toast.error(err.response.data.message)
                navigate("/log-in")
            }
        }
    }

    useEffect(()=>{
        getPlaylists()
    },[])
  return (
    <div className='home'>
        <HomeNav />
        <section className="page">
            <form className='searchForm' action="" method='GET'>
                <input type="text" name='search' defaultValue={search} placeholder='example: Rok' />
                <button>Search</button>
                <a href="/playlists">Reset</a>
            </form>

            {playlists.length ? <ul className='songs'>
                {playlists.map(playlist => {
                    return(<PlaylistItem key={playlist._id} favourites={true} playlist={playlist} editBtn={true} deleteBtn={true} />)
                })}
            </ul> : <p className='notFound'>Nije pronadjena nijedna playlista</p>}
        </section>
    </div>
  )
}
