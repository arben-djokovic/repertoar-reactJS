import React, { useEffect, useState } from 'react'
import api from '../../api/apiCalls'
import './Artists.scss'
import Dropdown from '../../components/Dropdown/Dropdown'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Artists() {
    let [artists, setArtists] = useState([])
    const navigate = useNavigate()

    const getAllArtists = async() => {
        try{
            const response = await api.get("/artists")
            setArtists(response.data)
        }catch(err){
            console.log(err)
        }
    }

    const deleteArtist = async(e, id) => {
        const confrim = window.confirm("Da li ste sigurni?")
        if(confrim){
            try{
                const response = await api.delete('/artists/'+id)
                if(response.data.acknowledged){
                    toast.success("Uspjesno brisanje artista")
                    e.target.parentElement.parentElement.parentElement.style.display = 'none'
                }
            }catch(err){
                console.log(err)
            }
        }
    }

    useEffect(()=>{
        getAllArtists()
    },[])
  return (
    <div className='artistPage'>
        <button onClick={()=>{navigate("/add-artist")}}>+ ADD ARTIST</button>
        <ul className='artists'>
            {artists.map(artist => {
                return <li key={artist._id} className='artist'>
                    <h3>{artist.name}</h3>
                    <Dropdown>
                        <li onClick={()=>{navigate('/edit-artist/'+artist._id)}}>edit</li>
                        <li onClick={(e)=>{deleteArtist(e, artist._id)}}>delete</li>
                    </Dropdown>
                </li>
            })}
        </ul>
    </div>
  )
}
