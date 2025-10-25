import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUserWorkOutPlan } from "../../api/trainer/userWorkOutPlan";

const AssignWorkOutPlan = ({ workOutPlans, userId, currWorkOutPlan }) => {
    const auth = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const [userWorkOutPlan, setUserWorkOutPlan] = useState(currWorkOutPlan)
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(!currWorkOutPlan ? true : false);
    const [formData, setFormData] = useState({
        userId: userId,
        workout_plan_id: userWorkOutPlan?.workout_plan_id?._id || "",
        start_date: userWorkOutPlan?.start_date?.slice(0, 10) || "",
        end_date: userWorkOutPlan?.end_date?.slice(0, 10) || "",
        assigned_by: auth.userId
    });

    console.log(workOutPlans);
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAssignWorkOutPlan = async (e) => {
        e.preventDefault();
        try {
            setError("")
            const result = await createUserWorkOutPlan(formData, auth.token);
            if (result.success) {
                setUserWorkOutPlan(result.data)
                setEditMode(false)
            } else {
                console.log(result);
                setError(result);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Failed to update Fitness Program:", err);
        }
    };


    return (
        <div>
            <div className="bg-white rounded-2xl shadow p-5 ">
                {(userWorkOutPlan && !editMode) ? (
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm mb-1">
                                <span className="font-medium">Plan:</span>{" "}
                                <button
                                    className="text-blue-600 underline"
                                    onClick={() => navigate(`/trainer/addworkoutplan/${userWorkOutPlan.workout_plan_id?._id}`)}
                                >
                                    {userWorkOutPlan.workout_plan_id?.name}
                                </button>
                            </p>
                            <p className="text-xs text-gray-600">
                                {new Date(userWorkOutPlan.start_date).toLocaleDateString()} →{" "}
                                {new Date(userWorkOutPlan.end_date).toLocaleDateString()}
                            </p>
                        </div>

                        <button
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </button>
                    </div>
                ) : (

                    editMode &&
                    // 🚫 No plan yet → show assignment form
                    <form className="grid grid-cols-3 gap-3 text-sm" onSubmit={handleAssignWorkOutPlan} >
                        <div className="col-span-3">
                            <label className="block mb-1 font-medium">WorkOut Plan</label>
                            <select className="w-full border rounded px-2 py-1" value={formData.workout_plan_id} name="workout_plan_id"
                                onChange={handleChange} >
                                <option value="">-- Select WorkOut Plan --</option>
                                {workOutPlans.map((plan) => (
                                    <option key={plan._id} value={plan._id}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Start Date</label>
                            <input type="date" className="w-full border rounded px-2 py-1" name="start_date"
                                value={formData.start_date} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">End Date</label>
                            <input type="date" className="w-full border rounded px-2 py-1" name="end_date"
                                value={formData.end_date} onChange={handleChange} />
                        </div>

                        <div className="col-span-3 text-right">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"  >
                                Assign Plan
                            </button>
                            <button className="bg-white text-blue-600 px-4 py-1 ml-2 border-blue-400 rounded hover:bg-blue-100" onClick={() => setEditMode(false)} >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                {error &&
                    <div>
                        <span className='text-red-400 p-5'>{error}</span>
                    </div>}
            </div>

        </div>
    );
};


export default AssignWorkOutPlan;
