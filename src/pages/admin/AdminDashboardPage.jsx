import React from 'react'
import MetricsCard from '../../components/admin/MetricsCard'
import SideBarMenu from '../../components/admin/SideMenuBar'
import UserGrowthStatistics from '../../components/admin/UserGrowthStatistics'
import TrainerUsersBarChart from '../../components/admin/TrainerUsersBarChart'


function AdminDashboardPage() {
  return (
    <div >
      <MetricsCard />

      <div className='m-5 border'>
        <div className='relative text-md font-bold text-blue-800 m-5'>Trainer Assignment Pending
          <span className='absolute m-1'>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
          </span>
        </div>
        <div className='relative text-md font-bold text-blue-800 m-5'>Trainer Approval Pending
          <span className='absolute m-1'>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
          </span>
        </div>
      </div>

      <div className='ml-5'>
        <UserGrowthStatistics />
      </div>

      <div className='ml-5'>
        <TrainerUsersBarChart />
      </div>

    </div>
  )
}

export default AdminDashboardPage
