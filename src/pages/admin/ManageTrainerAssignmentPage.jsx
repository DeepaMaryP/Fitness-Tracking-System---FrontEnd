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
    <div>
      <div>
        <div>
          <div>
            <div className="flex flex-col gap-2 sm:flex-row justify-around items-center px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
              <h1 className='text-xl font-bold'>Manage Trainer Assignments</h1>
              <div>
                <Link to={`/admin/assigntrainer`}>
                  <button className="text-white block bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:focus:ring-blue-900">Add New</button>
                </Link>
              </div>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full my-10 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white text-justify uppercase bg-blue-800 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th scope="col" className="text-center">
                      User
                    </th>
                    <th scope="col" className="text-center">
                      Trainer
                    </th>
                    <th scope="col" className="px-6 py-3">
                     StartDate
                    </th>
                    <th scope="col" className="py-3 px-6">
                    EndDate
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    assignments?.map(usertrainer =>
                      <tr key={usertrainer.userId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="text-center">
                          {usertrainer.userName}
                        </td>
                        <td className="text-center">
                          {usertrainer.trainerNames}
                        </td>
                        <td className="px-6 py-4">
                          {usertrainer.startDate}
                        </td>
                        <td className="px-6 py-4">
                          {usertrainer.endDate}
                        </td>
                        <td className="relative flex flex-col items-center sm:flex-row p-2 sm:p-4 sm:space-x-2">
                          <Link to={`/admin/assigntrainer/${usertrainer.userId}`}>
                            <button className="bg-blue-500 text-white px-3 py-1 mb-2 sm:mb-0 rounded-md text-xs md:text-sm">Edit</button>
                          </Link>
                          <button onClick={() => doDeleteAssignment(usertrainer.userId)} className="bg-red-500 text-white px-3 py-1 rounded-md text-xs md:text-sm" >Delete</button>
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

export default ManageTrainerAssignmentPage
