import React, { useState } from 'react'
import './Dropdown.scss'

export default function Dropdown({children}) {
    let [isOpen, setIsOpen] = useState(false)


  return (
    <div className='dropdown'>
        {isOpen && <div onClick={(e)=>{e.stopPropagation() ;setIsOpen(false)}} className="back"></div>}
        <i onClick={(e)=>{e.stopPropagation(); setIsOpen(!isOpen)}} className="fa fa-ellipsis-v"></i>
        {isOpen && <ul className='dropdown-ul' onClick={(e)=>{e.stopPropagation()}}>
            {children}
        </ul>}

    </div>
  )
}
