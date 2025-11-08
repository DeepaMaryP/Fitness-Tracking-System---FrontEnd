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
    <div className="p-2 sm:p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-3 mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 text-center sm:text-left">
          Manage Fitness Programs
        </h1>
        <Link to="/admin/addfitness">
          <button className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center">
            Add New
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-blue-800">
            <tr>
              <th scope="col" className="px-3 sm:px-6 py-3 text-center">Name</th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-center">Description</th>
              <th scope="col" className="px-3 sm:px-6 py-3">Price</th>
              <th scope="col" className="px-3 sm:px-6 py-3">Duration</th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fitprogramList?.map((program) => (
              <tr
                key={program._id}
                className="bg-white border-b hover:bg-gray-50 transition"
              >
                <td className="px-3 sm:px-6 py-2 text-center text-gray-700 break-words">
                  {program.name}
                </td>
                <td className="px-3 sm:px-6 py-2 text-center text-gray-700 break-words">
                  {program.description}
                </td>
                <td className="px-3 sm:px-6 py-2">{program.price}</td>
                <td className="px-3 sm:px-6 py-2">{program.duration_days}</td>
                <td className="px-3 sm:px-6 py-2">
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Link to={`/admin/addfitness/${program._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => doDeleteProgram(program._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FitnessProgramListPage
