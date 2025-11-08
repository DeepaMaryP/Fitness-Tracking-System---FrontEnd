import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteUserTrainerByUser, fetchAllUserTrainers } from '../../api/admin/usertrainer';

function ManageTrainerAssignmentPage() {
  const [assignments, setAssignments] = useState([]);
  const auth = useSelector((state) => state.auth)

  const loadAssignments = async () => {
    try {
      const data = await fetchAllUserTrainers(auth.token)
      setAssignments(data)
    } catch (err) {
      console.error("Error fetching Assignments:", err)
    }
  }

  const doDeleteAssignment = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this Assignment?")) {
        const data = await deleteUserTrainerByUser(id, auth.token)
        if (data.success) {
          console.log("Succesully deleted Trainer Assignments")
          await loadAssignments()
        } else {
          console.log(data.message);
        }
      } else {
        // User cancelled
        console.log("Deletion cancelled.");
      }
    } catch (err) {
      console.error("Failed to delete Trainer Assignment:", err)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  return (
    <div className="p-2 sm:p-4 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-3 mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0 text-center sm:text-left">
          Manage Trainer Assignments
        </h1>
        <Link to="/admin/assigntrainer">
          <button className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center">
            Add New
          </button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="relative overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-blue-800">
            <tr>
              <th scope="col" className="px-3 sm:px-6 py-3 text-center">User</th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-center">Trainer</th>
              <th scope="col" className="px-3 sm:px-6 py-3">Start Date</th>
              <th scope="col" className="px-3 sm:px-6 py-3">End Date</th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignments?.map((usertrainer) => (
              <tr
                key={usertrainer.userId}
                className="bg-white border-b hover:bg-gray-50 transition"
              >
                <td className="px-3 sm:px-6 py-2 text-center text-gray-700">
                  {usertrainer.userName}
                </td>
                <td className="px-3 sm:px-6 py-2 text-center text-gray-700">
                  {usertrainer.trainerNames}
                </td>
                <td className="px-3 sm:px-6 py-2">{usertrainer.startDate}</td>
                <td className="px-3 sm:px-6 py-2">{usertrainer.endDate}</td>
                <td className="px-3 sm:px-6 py-2">
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Link to={`/admin/assigntrainer/${usertrainer.userId}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => doDeleteAssignment(usertrainer.userId)}
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

export default ManageTrainerAssignmentPage
