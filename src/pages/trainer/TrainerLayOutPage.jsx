import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarMenu from '../../components/trainer/TrainerSideBarMenu'
import UserHeader from '../../components/user/UserHeader'

function TrainerLayOutPage() {
    return (
        <div className="relative min-h-screen bg-gray-50">
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <UserHeader />
            </div>

             <div className="flex flex-col sm:flex-row pt-16">
                  <div className="sm:w-56 sm:shrink-0">
                    <SideBarMenu />
                </div>
                 <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen relative z-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default TrainerLayOutPage

