import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteWorkOutPlan, fetchAllWorkOutPlan } from '../../api/trainer/workOutPlan';

function ManageWorkoutPlanListPage() {
    const [workOutPlanList, setWorkOutPlanList] = useState([]);
    const auth = useSelector((state) => state.auth)

    const loadWorkOutPlan = async () => {
        try {
            const result = await fetchAllWorkOutPlan(auth.token)               
            if (result.success && result.data) {           
                setWorkOutPlanList(result.data)
            }
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">🏋️ Manage Workout Plan</h1>
                <Link to={`/trainer/addworkOutPlan`}>
                    <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5">
                        + Add New
                    </button>
                </Link>
            </div>

            <div className="w-full max-w-6xl bg-white rounded-xl shadow overflow-hidden mt-6">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-white uppercase bg-blue-800">
                        <tr>
                            <th className="text-center py-3">Name</th>
                            <th className="text-center py-3">Duration (Days)</th>
                            <th className="text-center py-3">Level</th>
                            <th className="text-center py-3">Workout Type</th>
                            <th className="text-center py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOutPlanList?.length > 0 ? (
                            workOutPlanList.map((workout) => (
                                <tr
                                    key={workout._id}
                                    className="odd:bg-gray-50 even:bg-white hover:bg-blue-50 border-b border-gray-200"
                                >
                                    <td className="text-center py-3">{workout.name}</td>
                                    <td className="text-center py-3">{workout.duration_days}</td>
                                    <td className="text-center py-3">{workout.level}</td>
                                    <td className="text-center py-3">{workout.workout_type}</td>
                                    <td className="flex justify-center gap-2 py-3">
                                        <Link to={`/trainer/addworkOutPlan/${workout._id}`}>
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs md:text-sm hover:bg-blue-600">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-xs md:text-sm hover:bg-red-600"
                                            onClick={() => doDeleteWorkOutPlan(workout._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No workout plans found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default ManageWorkoutPlanListPage

