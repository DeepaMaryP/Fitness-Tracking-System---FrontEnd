import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import RupeeSign from '../../assets/rupee-sign.svg'

import { useState } from 'react';
import { getApprovedTrainerCount } from '../../api/admin/trainerProfile';
import { getMetrics, getMonthlyRevenue } from '../../api/admin/reports';


function MetricsCard() {
    const auth = useSelector((state) => state.auth)
    let [regUser, setRegUser] = useState();
    let [activeUsers, setActiveUsers] = useState()
    let [approvedTrainers, setApprovedTrainers] = useState()
    let [revenue, setRevenue] = useState();

    const getUserMetrics = async () => {
        try {
            const data = await getMetrics(auth.token);
            if (data.success) {
                setRegUser(data.userCounts[0].totalRegdUsers)
                setActiveUsers(data.userCounts[0].paidUsers)
            } else {
                console.log(data);
            }
        } catch (err) {
            console.error("Failed to get user metrics:", err);
        }
    };

    const getEarningsOfMonth = async () => {
        try {
            const date = new Date()
            const data = await getMonthlyRevenue(date, auth.token);
            if (data.success) {
                setRevenue(data.earnings)
            } else {
                console.log(data);
            }
        } catch (err) {
            console.error("Failed to get earnings of month:", err);
        }
    };

    const getTrainerCount = async () => {
        try {
            const data = await getApprovedTrainerCount(auth.token);
            if (data.success) {
                setApprovedTrainers(data.count)
            } else {
                console.log(data);
            }
        } catch (err) {
            console.error("Failed to get trainer count:", err);
        }
    };

    useEffect(() => {
        getUserMetrics()
        getTrainerCount()
        getEarningsOfMonth()
    }, [])

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-4">
    {/* Subscribed Users */}
    <button
      type="button"
      className="text-white flex flex-col justify-center items-center h-28 sm:h-32 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-lg px-4 py-3 text-center rounded-xl shadow-md transition-all duration-200"
    >
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
        <span className="ml-2">Subscribed Users</span>
      </div>
      <span className="inline-flex items-center justify-center w-10 h-10 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
        {activeUsers}
      </span>
    </button>

    {/* Registered Users */}
    <button
      type="button"
      className="text-gray-900 flex flex-col justify-center items-center h-28 sm:h-32 bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-100 font-medium text-lg px-4 py-3 text-center rounded-xl shadow-md transition-all duration-200"
    >
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
          <circle cx="12" cy="10" r="3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span className="ml-2">Registered Users</span>
      </div>
      <span className="inline-flex items-center justify-center w-10 h-10 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
        {regUser}
      </span>
    </button>

    {/* Approved Trainers */}
    <button
      type="button"
      className="text-white flex flex-col justify-center items-center h-28 sm:h-32 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium text-lg px-4 py-3 text-center rounded-xl shadow-md transition-all duration-200"
    >
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span className="ml-2">Approved Trainers</span>
      </div>
      <span className="inline-flex items-center justify-center w-10 h-10 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
        {approvedTrainers}
      </span>
    </button>

    {/* Total Earnings */}
    <button
      type="button"
      className="text-white flex flex-col justify-center items-center h-28 sm:h-32 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-lg px-4 py-3 text-center rounded-xl shadow-md transition-all duration-200"
    >
      <div className="flex items-center mb-2">
        <img src={RupeeSign} alt="₹" className="h-6 w-6" />
        <span className="ml-2">Total Earnings</span>
      </div>
      <span className="inline-flex items-center justify-center w-10 h-10 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
        {revenue}
      </span>
    </button>
  </div>
)

}

export default MetricsCard
