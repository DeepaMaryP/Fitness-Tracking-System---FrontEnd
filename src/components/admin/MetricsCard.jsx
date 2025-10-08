import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import RupeeSign from '../../assets/rupee-sign.svg'
import { getMetrics } from '../../api/admin/user';
import { useState } from 'react';
import { getApprovedTrainers } from '../../api/admin/trainerProfile';


function MetricsCard() {
    const auth = useSelector((state) => state.auth)
    let [regUser, setRegUser] = useState();
    let [activeUsers, setActiveUsers] = useState()
    let [approvedTrainers, setApprovedTrainers] = useState()

    const getUserMetrics = async () => {
        try {
            const data = await getMetrics(auth.token);
            if (data.success) {
                setRegUser(data.userCounts[0].totalRegdUsers)
                setActiveUsers(data.userCounts[0].activeUsers)
            } else {
                console.log(data);
            }
        } catch (err) {            
            console.error("Failed to get user metrics:", err);
        }
    };

     const getTrainerCount = async () => {
        try {
            const data = await getApprovedTrainers(auth.token);
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
    }, [])

    return (
        <div className='grid grid-cols-4 m-5'>
            <button type="button" className="text-white h-24 bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-xl px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                <span className='ml-2'> Active Users</span>
                <span className="inline-flex items-center justify-center w-8 h-8 ms-2 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
                    {activeUsers}
                </span>
            </button>
            <button type="button" className="text-white h-24 bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-100 font-medium  text-xl px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:ring-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" /><circle cx="12" cy="10" r="3" /><circle cx="12" cy="12" r="10" /></svg>
                <span className='ml-2'>Registered Users</span>
                <span className="inline-flex items-center justify-center w-8 h-8 ms-2 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
                    {regUser}
                </span>
            </button>
            <button type="button" className="text-white h-24 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium  text-xl px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span className='ml-2'>Approved Trainers</span>
                <span className="inline-flex items-center justify-center w-8 h-8 ms-2 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
                    {approvedTrainers}
                </span>
            </button>
            <button type="button" className="text-white h-24 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium  text-xl px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                <img src={RupeeSign} className='h-8' alt="" />
                <span className='ml-2'>Total Earnings</span>
                <span className="inline-flex items-center justify-center w-8 h-8 ms-2 text-md font-semibold text-blue-800 bg-blue-200 rounded-full">
                    2
                </span>
            </button>
        </div>
    )
}

export default MetricsCard
