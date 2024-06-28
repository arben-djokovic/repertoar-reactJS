import React, { useRef } from 'react'
import './CreatePlaylist/CreatePlaylist.scss'
import api from '../api/apiCalls'
import { toast } from 'react-toastify'

export default function AddArtist() {
    const artistNameRef = useRef()

    const addArtist = async(e) => {
        e.preventDefault()
        if(artistNameRef.current.value.length < 2){
            toast.error("Naziv artista mora sadrzati minimum 2 karaktera")
            return;
        }
        try{
            const result = await api.post("/artists/add", {
                name: artistNameRef.current.value
            })
            console.log(result)
            toast.success("Artist uspjesno dodan")
        }catch(err) {
            console.log(err)
            toast.error("Neuspjesno dodavanje artista")
        }
    }

  return (<div className='create-playlist'>
    <form>
        <div className="inputDiv">
            <p>Artist name</p>
            <input ref={artistNameRef} type="text" name='artist' />
        </div>
        <button onClick={addArtist}>Add Artist</button>
    </form>
    </div>
  )
}
