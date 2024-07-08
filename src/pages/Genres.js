import React, { useEffect, useState } from 'react'
import api from '../api/apiCalls'
import './Artists/Artists.scss'
import Dropdown from '../components/Dropdown/Dropdown'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Genres() {
    let [genres, setGenres] = useState([])
    const navigate = useNavigate()

    const getAllGenres = async() => {
        try{
            const response = await api.get("/genres")
            setGenres(response.data)
        }catch(err){
            console.log(err)
        }
    }

    const deleteGenre = async(e, id) => {
        const confrim = window.confirm("Da li ste sigurni?")
        if(confrim){
            try{
                const response = await api.delete('/genres/'+id)
                if(response.data.acknowledged){
                    toast.success("Uspjesno brisanje zanra")
                    e.target.parentElement.parentElement.parentElement.style.display = 'none'
                }
            }catch(err){
                console.log(err)
            }
        }
    }

    useEffect(()=>{
        getAllGenres()
    },[])
  return (
    <div className='artistPage'>
        <ul className='artists'>
            {genres.map(genre => {
                return <li key={genre._id} className='artist'>
                    <h3>{genre.name}</h3>
                    <Dropdown>
                        <li onClick={()=>{navigate('/edit-genre/'+genre._id)}}>edit</li>
                        <li onClick={(e)=>{deleteGenre(e, genre._id)}}>delete</li>
                    </Dropdown>
                </li>
            })}
        </ul>
    </div>
  )
}
