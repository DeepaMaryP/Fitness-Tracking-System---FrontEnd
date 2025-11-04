import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarMenu from '../../components/admin/AdminSideBarMenu'
import UserHeader from '../../components/user/UserHeader'

function AdminLayOutPage() {
    return (
        <div>
           <UserHeader />
            <div className='grid grid-cols-6 mt-2  rounded-lg'>
                <div className='col-span-1'>
                    <SideBarMenu />
                </div>
                <div className='col-span-5 ml-8'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayOutPage
