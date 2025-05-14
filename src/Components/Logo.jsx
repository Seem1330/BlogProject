import React from 'react'
import reactLogo from '../assets/react.svg'

function Logo({width='100px' }) {
  return (
    <div className=" text-2xl text-white">          
    <img src={reactLogo} alt="React logo" />
    Logo 
</div>
  )
}

export default Logo