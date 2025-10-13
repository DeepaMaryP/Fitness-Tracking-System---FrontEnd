import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { approveTrainerDetails, getAllTrainers } from '../../api/admin/trainerProfile';
import { useSelector } from 'react-redux';

function ManageTrainerPage() {
    const [trainersList, setTrainersList] = useState([]);
    const auth = useSelector((state) => state.auth)

    const loadTrainers = async () => {
        try {
            const data = await getAllTrainers(auth.token)
            setTrainersList(data)
        } catch (err) {
            console.error("Error fetching trainers:", err)
        }
    }

    const blockTrainer = (id) => {
        if (window.confirm("Are you sure you want to block this trainer?")) {

            console.log("Trainer blocked.");
        } else {
            // User cancelled
            console.log("Deletion cancelled.");
        }
    }

    const approveTrainer = async (id) => {
        try {
            if (window.confirm("Are you sure you want to approve this trainer?")) {
                const data = await approveTrainerDetails(id, auth.userId, auth.token)
                if (data.success) {
                    console.log("Successfully Approved trainer")
                    await loadTrainers()
                } else {
                    console.log(data.message);
                }
            } else {
                // User cancelled
                console.log("Approval cancelled.");
            }
        } catch (err) {
            console.error("Failed to approve trainer:", err)
        }
    }

    useEffect(() => {
        loadTrainers();
    }, [])

    return (
        <div>
            <div>
                <div>
                    <div className="flex flex-col gap-2 sm:flex-row justify-around items-center px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
                        <h1 className='text-xl font-bold'>Manage Trainers</h1>
                    </div>

                    <div className="relative overflow-x-auto">
                        <table className="w-full my-10 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-white text-justify uppercase bg-blue-800 dark:bg-gray-700 dark:text-white">
                                <tr>
                                    <th scope="col" className="text-center">
                                        Name
                                    </th>
                                    <th scope="col" className="text-center">
                                        Qualification
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Experience
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Specialization
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Certification
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Status
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    trainersList?.map(trainer =>
                                        <tr key={trainer._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="text-center">
                                                {trainer.userId?.name}
                                            </td>
                                            <td className="text-center">
                                                {trainer.qualification}
                                            </td>
                                            <td className="px-6 py-4">
                                                {trainer.experience_years}
                                            </td>
                                            <td className="px-6 py-4">
                                                {trainer.specialization}
                                            </td>
                                            <td className="px-6 py-4">
                                                {trainer.certification}
                                            </td>
                                            <td className="px-6 py-4">
                                                {trainer.approvedStatus}
                                            </td>
                                            <td className="relative flex flex-col items-center sm:flex-row p-2 sm:p-4 sm:space-x-2">
                                                {trainer.approvedStatus == "pending" &&
                                                    <button className="bg-blue-500 text-white px-3 py-1 mb-2 sm:mb-0 rounded-md text-xs md:text-sm" onClick={() => approveTrainer(trainer._id)}>Approve</button>}
                                                {trainer.approvedStatus == "approved" &&
                                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs md:text-sm" onClick={() => blockTrainer(trainer._id)}>Block</button>}
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
    )
}

export default ManageTrainerPage
