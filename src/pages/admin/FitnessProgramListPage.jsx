import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { deleteFitnessProgaram, fetchAllFitnessProgram } from '../../api/admin/fitnessPrograms';

function FitnessProgramListPage() {
    const [fitprogramList, setFitprogramList] = useState([]);
    const auth = useSelector((state) => state.auth)

    const loadFitnessPrograms = async () => {
        try {
            const result = await fetchAllFitnessProgram(auth.token)
            if (result.success) {
                setFitprogramList(result.allPaymentPlan);
            }

        } catch (err) {
            console.error("Error fetching FitnessPrograms:", err)
        }
    }

    const doDeleteProgram = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this Fitness Program?")) {
                const data = await deleteFitnessProgaram(id, auth.token)
                if (data.success) {
                    console.log("Succesully deleted Fitness Program")
                    await loadFitnessPrograms()
                } else {
                    console.log(data.message);
                }
            } else {
                // User cancelled
                console.log("Deletion cancelled.");
            }
        } catch (err) {
            console.error("Failed to delete Fitness Program:", err)
        }
    }

    useEffect(() => {
        loadFitnessPrograms()
    }, [])

    return (
        <div>
            <div>
                <div>
                    <div>
                        <div className="flex flex-col gap-2 sm:flex-row justify-around items-center px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
                            <h1 className='text-xl font-bold'>Manage Fitness Programs</h1>
                            <div>
                                <Link to={`/admin/addfitness`}>
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
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Price
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Duration
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        fitprogramList?.map(program =>
                                            <tr key={program._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="text-center">
                                                    {program.name}
                                                </td>
                                                <td className="text-center">
                                                    {program.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {program.price}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {program.duration_days}
                                                </td>
                                                <td className="relative flex flex-col items-center sm:flex-row p-2 sm:p-4 sm:space-x-2">
                                                    <Link to={`/admin/addfitness/${program._id}`}>
                                                        <button className="bg-blue-500 text-white px-3 py-1 mb-2 sm:mb-0 rounded-md text-xs md:text-sm">Edit</button>
                                                    </Link>
                                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs md:text-sm" onClick={() => doDeleteProgram(program._id)}>Delete</button>
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

export default FitnessProgramListPage
