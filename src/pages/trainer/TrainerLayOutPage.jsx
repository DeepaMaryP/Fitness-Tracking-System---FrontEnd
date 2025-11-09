import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarMenu from '../../components/trainer/TrainerSideBarMenu'
import UserHeader from '../../components/user/UserHeader'

function TrainerLayOutPage() {
    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
                <UserHeader />
            </div>

            {/* Main Section below Header */}
            <div className="flex flex-1 pt-[64px] overflow-hidden">
                {/* Sidebar */}
                <SideBarMenu />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default TrainerLayOutPage

