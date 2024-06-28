import React, { useRef } from 'react'
import './CreatePlaylist/CreatePlaylist.scss'
import api from '../api/apiCalls'
import { toast } from 'react-toastify'

export default function AddGenre() {
    const genreNameRef = useRef()

    const addGenre = async(e) => {
        e.preventDefault()
        if(genreNameRef.current.value.length < 2){
            toast.error("Naziv zanra mora sadrzati minimum 2 karaktera")
            return;
        }
        try{
            const result = await api.post("/genres/add", {
                name: genreNameRef.current.value
            })
            console.log(result)
            toast.success("Zanr uspjesno dodan")
        }catch(err) {
            console.log(err)
            toast.error("Neuspjesno dodavanje zanra")
        }
    }
  return (<div className='create-playlist'>
    <form>
        <div className="inputDiv">
            <p>Genre name</p>
            <input ref={genreNameRef} type="text" name='genre' />
        </div>
        <button onClick={addGenre}>Add Genre</button>
    </form>
    </div>
  )
}
