import React from 'react'
import { Outlet } from 'react-router-dom'

function LayOutPage() {
  return (
    <div>    
      <div>
        { <Outlet/> }
      </div>       
    </div>
  )
}

export default LayOutPage
