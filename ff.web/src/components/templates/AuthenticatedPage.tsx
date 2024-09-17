import React from 'react'
import Navbar from '../atoms/Navbar'

export default function AuthenticatedPage({children}: any) {

  return (
    <div>
        <Navbar/>
        {children}
        
    </div>
  )
}
