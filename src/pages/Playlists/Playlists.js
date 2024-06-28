import React, { useEffect, useState } from 'react'
import api from '../../api/apiCalls'
import { useLocation } from 'react-router-dom';
import HomeNav from '../../components/home-nav/HomeNav';
import '../Home/Home.scss'

export default function Playlists() {
    let [playlists, setPlaylists] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');

    const getPlaylists = async() => {
        let apiCall = '/playlists/'
        if(search && search.length > 0){
            apiCall += "?search="+search
        }
        try{
            const response =  await api.get(apiCall)
            setPlaylists(response.data)
        }catch(err){

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

            {playlists.length ? <ul>
                {playlists.map(playlist => {
                    return(<li><a href={"/playlists/"+playlist._id}>
                        <h3>{playlist.name}</h3></a>
                    </li>)
                })}
            </ul> : <p className='notFound'>Nije pronadjena nijedna playlista</p>}
        </section>
    </div>
  )
}
