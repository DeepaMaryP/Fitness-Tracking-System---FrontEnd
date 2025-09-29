import React from 'react'
import { Outlet } from 'react-router-dom'

import Home from './Home'
import AdminDashboardPage from './admin/AdminDashboardPage'
import UserListPage from './admin/userListPage'

function LayOutPage() {
  return (
    <div>
       { <Outlet/> }
    </div>
  )
}

export default LayOutPage
