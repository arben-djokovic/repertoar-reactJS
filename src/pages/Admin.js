import React, { useEffect } from 'react'
import api from '../api/apiCalls'
import { toast } from 'react-toastify'

export default function Admin() {
    const test= async() => {
        try{
            const response = await api.post("/artist/add", {name: "testiranjee"})
            console.log(response)
        }catch(err){
            toast.error(err.response.data.message)
        }
    }
    useEffect(()=>{
        test()
    },[])
  return (
    <div>Admin</div>
  )
}
