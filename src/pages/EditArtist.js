import React, { useEffect, useRef, useState } from 'react'
import './CreatePlaylist/CreatePlaylist.scss'
import api from '../api/apiCalls'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditArtist() {
    const navigate = useNavigate()
    const [artistName, setArtistsName] = useState('')
    const {id} = useParams()

    const getArtist = async() => {
        try{
            const response = await api.get("/artists/"+id)
            setArtistsName(response.data.name)
        }catch(err){
            console.log(err)
        }
    }

    const editArtist = async(e) => {
        e.preventDefault()
        if(artistName.length < 2){
            toast.error("Naziv artista mora sadrzati minimum 2 karaktera")
            return;
        }
        try{
            const result = await api.patch("/artists/"+id, {
                newName: artistName
            })
            toast.success("Artist uspjesno editovan")
            navigate("/artists")
        }catch(err) {
            console.log(err)
            toast.error("Neuspjesno editovanje artista")
        }
    }


    useEffect(()=>{
        getArtist()
    },[])

  return (<div className='create-playlist'>
    <form>
        <div className="inputDiv">
            <p>Artist name</p>
            <input value={artistName} onChange={(e)=>{setArtistsName(e.target.value)}} type="text" name='artist' />
        </div>
        <button onClick={editArtist}>Edit Artist</button>
    </form>
    </div>
  )
}
