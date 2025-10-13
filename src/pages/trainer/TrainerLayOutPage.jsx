import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarMenu from '../../components/trainer/TrainerSideBarMenu'

function TrainerLayOutPage() {
    return (
        <div>
            <div className='font-bold text-2xl bg-blue-900  pl-8 pt-2  text-white '>
                FitTrack
            </div>
            <div className='grid grid-cols-6 rounded-lg'>
                <div className='col-span-1'>
                    <SideBarMenu />
                </div>
                <div className='col-span-5 ml-5'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default TrainerLayOutPage

