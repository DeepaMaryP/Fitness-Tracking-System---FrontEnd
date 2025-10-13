import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import MetricsCard from '../../components/admin/MetricsCard'
import UserGrowthStatistics from '../../components/admin/UserGrowthStatistics'
import TrainerUsersBarChart from '../../components/admin/TrainerUsersBarChart'
import { signIn } from '../../api/auth'

function AdminDashboardPage() {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState(
    {
      email: 'admin@gmail.com',
      password: '12345'
    }
  );

  useEffect(() => {
    try {
      dispatch(signIn(credentials))

    } catch (error) {
      console.log(error);      
    }
  }, [])

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
