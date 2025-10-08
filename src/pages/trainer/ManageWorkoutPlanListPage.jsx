import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteWorkOutPlan, fetchAllWorkOutPlan } from '../../api/trainer/workOutPlan';

function ManageWorkoutPlanListPage() {
    const [workOutPlanList, setWorkOutPlanList] = useState([]);
    const auth = useSelector((state) => state.auth)

    const loadWorkOutPlan = async () => {
        try {
            const data = await fetchAllWorkOutPlan(auth.token)
            setWorkOutPlanList(data)
        } catch (err) {
            console.error("Error fetching WorkOutPlan:", err)
        }
    }

    const doDeleteWorkOutPlan = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this WorkOutPlan?")) {
                const data = await deleteWorkOutPlan(id, auth.token)
                if (data.success) {
                    console.log("Succesully deleted WorkOutPlan")
                    await loadWorkOutPlan()
                } else {
                    console.log(data.message);
                }
            } else {
                // User cancelled
                console.log("Deletion cancelled.");
            }
        } catch (err) {
            console.error("Failed to delete WorkOutPlan:", err)
        }
    }

    useEffect(() => {
        loadWorkOutPlan()
    }, [])

    return (
        <div>
            <div>
                <div>
                    <div>
                        <div className="flex flex-col gap-2 sm:flex-row justify-around items-center px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
                            <h1 className='text-xl font-bold'>Manage WorkOut Plan</h1>
                            <div>
                                <Link to={`/admin/addworkOutPlan`}>
                                    <button className="text-white block bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900">Add New</button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto">
                            <table className="w-full my-10 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-white text-justify uppercase bg-blue-800 dark:bg-gray-700 dark:text-white">
                                    <tr>
                                        <th scope="col" className="text-center">
                                            Name
                                        </th>
                                        <th scope="col" className="text-center">
                                            Duration
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Level
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Workout Type
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        workOutPlanList?.map(workout =>
                                            <tr key={workout._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="text-center">
                                                    {workout.name}
                                                </td>
                                                <td className="text-center">
                                                    {workout.duration_days}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {workout.Level }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {workout.workout_type}
                                                </td>
                                                <td className="relative flex flex-col items-center sm:flex-row p-2 sm:p-4 sm:space-x-2">
                                                    <Link to={`/admin/addworkOutPlan/${workout._id}`}>
                                                        <button className="bg-blue-500 text-white px-3 py-1 mb-2 sm:mb-0 rounded-md text-xs md:text-sm">Edit</button>
                                                    </Link>
                                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs md:text-sm" onClick={() => doDeleteWorkOutPlan(workout._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageWorkoutPlanListPage

