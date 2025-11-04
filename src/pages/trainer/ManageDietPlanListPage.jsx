import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteDietPlan, fetchAllDietPlan } from '../../api/trainer/dietPlan';

function ManageDietPlanListPage() {
    const [dietPlanList, setDietPlanList] = useState([]);
    const auth = useSelector((state) => state.auth)

    const loadDietPlan = async () => {
        try {
            const result = await fetchAllDietPlan(auth.token)
            setDietPlanList(result.data)
        } catch (err) {
            console.error("Error fetching DietPlan:", err)
        }
    }

    const doDeleteDietPlan = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this DietPlan?")) {
                const data = await deleteDietPlan(id, auth.token)
                if (data.success) {
                    console.log("Succesully deleted DietPlan")
                    await loadDietPlan()
                } else {
                    console.log(data.message);
                }
            } else {
                // User cancelled
                console.log("Deletion cancelled.");
            }
        } catch (err) {
            console.error("Failed to delete DietPlan:", err)
        }
    }

    useEffect(() => {
        loadDietPlan()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-5 px-4">
            {/* Header Section */}
            <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-5 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    🥗 Manage Diet Plan
                </h1>
                <Link to={`/trainer/adddietplan`}>
                    <button className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition duration-200">
                        + Add New
                    </button>
                </Link>
            </div>

            {/* Table Section */}
            <div className="w-full max-w-6xl bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-blue-700 text-white uppercase text-xs">
                        <tr>
                            <th className="py-3 px-6 text-center">Plan Name</th>
                            <th className="py-3 px-6 text-center">Goal Type</th>
                            <th className="py-3 px-6 text-center">Calories</th>
                            <th className="py-3 px-6 text-center">Protein (g)</th>
                            <th className="py-3 px-6 text-center">Carbs (g)</th>
                            <th className="py-3 px-6 text-center">Fat (g)</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dietPlanList?.length > 0 ? (
                            dietPlanList.map((diet, idx) => (
                                <tr
                                    key={diet._id}
                                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-blue-50 transition`}
                                >
                                    <td className="py-3 px-6 text-center font-medium text-gray-800">
                                        {diet.plan_name}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {diet.goal_type || "-"}
                                    </td>
                                    <td className="py-3 px-6 text-center font-semibold text-gray-700">
                                        {diet.total_calories ?? 0}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {diet.macros?.protein_g ?? 0}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {diet.macros?.carbs_g ?? 0}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {diet.macros?.fat_g ?? 0}
                                    </td>
                                    <td className="py-3 px-6 text-center flex flex-col sm:flex-row justify-center items-center gap-2">
                                        <Link to={`/trainer/adddietplan/${diet._id}`}>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => doDeleteDietPlan(diet._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    No diet plans found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageDietPlanListPage

