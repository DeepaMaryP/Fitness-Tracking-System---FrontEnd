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
        <div>
            <div>
                <div>
                    <div>
                        <div className="flex flex-col gap-2 sm:flex-row justify-around items-center px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
                            <h1 className='text-xl font-bold'>Manage Exercise Master</h1>
                            <div>
                                <Link to={`/trainer/addexercise`}>
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
                                            Exercise Type
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Difficulty Level
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            MET
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        exerciseList?.map(exercise =>
                                            <tr key={exercise._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="text-center">
                                                    {exercise.name}
                                                </td>
                                                <td className="text-center">
                                                    {exercise.exercise_type}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {exercise.difficulty_level}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {exercise.met}
                                                </td>
                                                <td className="relative flex flex-col items-center sm:flex-row p-2 sm:p-4 sm:space-x-2">
                                                    <Link to={`/trainer/addexercise/${exercise._id}`}>
                                                        <button className="bg-blue-500 text-white px-3 py-1 mb-2 sm:mb-0 rounded-md text-xs md:text-sm">Edit</button>
                                                    </Link>
                                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs md:text-sm" onClick={() => doDeleteExercise(exercise._id)}>Delete</button>
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

export default ManageExerciseMasterList
