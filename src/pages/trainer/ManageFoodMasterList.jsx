import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteFoodMaster, fetchAllFoodMaster } from '../../api/trainer/foodMaster';

function ManageFoodMasterList() {
  const [foodMasterList, setFoodMasterList] = useState([]);
  const auth = useSelector((state) => state.auth)

  const loadFoodMaster = async () => {
    try {
      const data = await fetchAllFoodMaster(auth.token)
      setFoodMasterList(data)
    } catch (err) {
      console.error("Error fetching FoodMaster:", err)
    }
  }

  const doDeleteFood = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this Food Master?")) {
        const data = await deleteFoodMaster(id, auth.token)
        if (data.success) {
          console.log("Succesully deleted FoodMaster")
          await loadFoodMaster()
        } else {
          console.log(data.message);
        }
      } else {
        // User cancelled
        console.log("Deletion cancelled.");
      }
    } catch (err) {
      console.error("Failed to delete FoodMaster:", err)
    }
  }

  useEffect(() => {
    loadFoodMaster()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-5 px-4">
      {/* Header Section */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-5 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          🍽️ Manage Food Master
        </h1>
        <Link to={`/trainer/addfoodmaster`}>
          <button className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition duration-200">
            + Add New
          </button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-blue-700 text-white uppercase text-xs">
            <tr>
              <th scope="col" className="py-3 px-6 text-center">Name</th>
              <th scope="col" className="py-3 px-6 text-center">Category</th>
              <th scope="col" className="py-3 px-6 text-center">Serving Size</th>
              <th scope="col" className="py-3 px-6 text-center">Calories</th>
              <th scope="col" className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodMasterList?.length > 0 ? (
              foodMasterList.map((food, idx) => (
                <tr
                  key={food._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition`}
                >
                  <td className="py-3 px-6 text-center font-medium text-gray-800">
                    {food.name}
                  </td>
                  <td className="py-3 px-6 text-center">{food.category}</td>
                  <td className="py-3 px-6 text-center">
                    {food.serving_size} {food.serving_unit}
                  </td>
                  <td className="py-3 px-6 text-center font-semibold text-gray-700">
                    {food.calories}
                  </td>
                  <td className="py-3 px-6 text-center flex flex-col sm:flex-row justify-center items-center gap-2">
                    <Link to={`/trainer/addfoodmaster/${food._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => doDeleteFood(food._id)}
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
                  No food items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFoodMasterList
