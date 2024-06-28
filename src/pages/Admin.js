import React, { useEffect } from 'react'

export default function Admin() {
    useEffect(()=>{
    },[])
  return (
    <div>
      <section style={{display: 'flex', flexDirection: 'column', gridGap: '20px', margin: '20px'}}>
          <a href="/create-playlist"><button>+ CREATE PLAYLIST</button></a>
          <a href="/add-song"><button>+ ADD SONG</button></a>
          <a href="/add-artist"><button>+ ADD ARTIST</button></a>
      </section>
    </div>
  )
}
