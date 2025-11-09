import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteExerciseMaster, fetchAllExerciseMaster } from '../../api/trainer/exerciseMaster';

function ManageExerciseMasterList() {

    const [exerciseList, setExerciseList] = useState([]);
    const auth = useSelector((state) => state.auth)

    const loadExerciseMaster = async () => {
        try {
            const data = await fetchAllExerciseMaster(auth.token)
            setExerciseList(data)
        } catch (err) {
            console.error("Error fetching ExerciseMaster:", err)
        }
    }

    const doDeleteExercise = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this Exercise Master?")) {
                const data = await deleteExerciseMaster(id, auth.token)
                if (data.success) {
                    console.log("Succesully deleted ExerciseMaster")
                    await loadExerciseMaster()
                } else {
                    console.log(data.message);
                }
            } else {
                // User cancelled
                console.log("Deletion cancelled.");
            }
        } catch (err) {
            console.error("Failed to delete ExerciseMaster:", err)
        }
    }

    useEffect(() => {
        loadExerciseMaster()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-5 px-4">
            {/* Header Section */}
            <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-5 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    💪 Manage Exercise Master
                </h1>
                <Link to={`/trainer/addexercise`}>
                    <button className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition duration-200">
                        + Add New
                    </button>
                </Link>
            </div>

            {/* Table Section */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-blue-700 text-white uppercase text-xs">
                        <tr>
                            <th scope="col" className="py-3 px-6 text-center">Name</th>
                            <th scope="col" className="py-3 px-6 text-center">Exercise Type</th>
                            <th scope="col" className="py-3 px-6 text-center">Difficulty Level</th>
                            <th scope="col" className="py-3 px-6 text-center">MET</th>
                            <th scope="col" className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exerciseList?.length > 0 ? (
                            exerciseList.map((exercise, idx) => (
                                <tr
                                    key={exercise._id}
                                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-blue-50 transition`}
                                >
                                    <td className="py-3 px-6 text-center font-medium text-gray-800">
                                        {exercise.name}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {exercise.exercise_type}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {exercise.difficulty_level}
                                    </td>
                                    <td className="py-3 px-6 text-center font-semibold text-gray-700">
                                        {exercise.met}
                                    </td>
                                    <td className="py-3 px-6 text-center flex flex-col sm:flex-row justify-center items-center gap-2">
                                        <Link to={`/trainer/addexercise/${exercise._id}`}>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => doDeleteExercise(exercise._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No exercises found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageExerciseMasterList
