import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarMenu from '../../components/trainer/TrainerSideBarMenu'
import UserHeader from '../../components/user/UserHeader'

function TrainerLayOutPage() {
    return (
        <div>
           <UserHeader />
            <div className='grid grid-cols-6 rounded-lg'>
                <div className='col-span-1'>
                    <SideBarMenu />
                </div>
                <div className='col-span-5 mt-5'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default TrainerLayOutPage

