import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import MetricsCard from '../../components/admin/MetricsCard'
import UserGrowthStatistics from '../../components/admin/UserGrowthStatistics'
import TrainerUsersBarChart from '../../components/admin/TrainerUsersBarChart'
import { getApprovalPendingTrainerCount, getPendingTrainerAssignments } from '../../api/admin/reports';

function AdminDashboardPage() {
  const auth = useSelector((state) => state.auth)
  let [pendingCount, setPendingCount] = useState()
  let [approvalCount, setApprovalCount] = useState()

  const getPendingAssignmentCount = async () => {
    try {
      const data = await getPendingTrainerAssignments(auth.token);
      if (data.success) {
        setPendingCount(data.count)
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error("Failed to get user metrics:", err);
    }
  };

  const getApprovalPendingCount = async () => {
    try {
      const data = await getApprovalPendingTrainerCount(auth.token);
      if (data.success) {
        setApprovalCount(data.count)
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error("Failed to get user metrics:", err);
    }
  };

  useEffect(() => {
    getPendingAssignmentCount();
    getApprovalPendingCount();
  }, [])

  return (
    <div >
      <MetricsCard />

      <div className='m-5 border'>
        {pendingCount > 0 &&
          <div className='relative text-md font-bold text-blue-800 m-5'>Trainer Assignment Pending
            <span className='absolute m-1'>
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-red-500"></span> <span className='text-green-800 px-2 pb-5 mx-5 text-sm font-medium border rounded-full '>{pendingCount}</span>
              </span>
            </span>
          </div>}
          {approvalCount > 0 && 
        <div className='relative text-md font-bold text-blue-800 m-5'>Trainer Approval Pending
          <span className='absolute m-1'>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span><span className='text-green-800 px-2 pb-5 mx-5 text-sm font-medium border rounded-full '>{approvalCount}</span>
            </span>
          </span>
        </div> }
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
