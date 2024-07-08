import React, { useEffect, useRef, useState } from 'react'
import './CreatePlaylist/CreatePlaylist.scss'
import api from '../api/apiCalls'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditGenre() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [genreName, setGenreName] = useState("")

    const getGenre = async() => {
        try{
            const response = await api.get("/genres/"+id)
            setGenreName(response.data.name)
        }catch(err){
            console.log(err)
        }
    }

    const editGenre = async(e) => {
        e.preventDefault()
        if(genreName.length < 2){
            toast.error("Naziv zanra mora sadrzati minimum 2 karaktera")
            return;
        }
        try{
            const result = await api.patch("/genres/"+id, {
                newName: genreName
            })
            console.log(result)
            toast.success("Zanr uspjesno editovan")
            navigate("/genres")
        }catch(err) {
            console.log(err)
            toast.error("Neuspjesno editovanje zanra")
        }
    }

    useEffect(()=>{
        getGenre()
    }, [])
  return (<div className='create-playlist'>
    <form>
        <div className="inputDiv">
            <p>Genre name</p>
            <input value={genreName} onChange={(e)=>{setGenreName(e.target.value)}} type="text" name='genre' />
        </div>
        <button onClick={editGenre}>Edit Genre</button>
    </form>
    </div>
  )
}
