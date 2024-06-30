import React from 'react'
import './Modal.scss'

export default function Modal({closeModal, children}) {
  return (
    <div onClick={(e)=>{e.stopPropagation()}} className='modal'>
        <div className="modal-content">
            <i onClick={(e)=>{closeModal()}} className="fa fa-times" aria-hidden="true"></i>
            {children}
        </div>
    </div>
  )
}
