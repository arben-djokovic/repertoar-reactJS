import React, { useEffect, useState } from 'react'
import api from '../../api/apiCalls'
import { useLocation } from 'react-router-dom';

export default function Home() {
    let [songs, setSongs] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');

    const getSongs = async() => {
        let apiCall = '/song/'
        if(search && search.length > 0){
            apiCall += "?search="+search
        }
        try{
            const response =  await api.get(apiCall)
            setSongs(response.data)
        }catch(err){

        }
    }

    useEffect(()=>{
        getSongs()
    },[])
  return (
    <div className='home'>
        <h1>Songs</h1>
        <form className='searchForm' action="" method='GET'>
            <input type="text" name='search' placeholder='Sve jos mirise na nju' />
            <button>Search</button>
        </form>
        <ul>
            {songs.map(song => {
                return(<li>{song.text}</li>)
            })}
        </ul>
    </div>
  )
}
