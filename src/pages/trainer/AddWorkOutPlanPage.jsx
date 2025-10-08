import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createWorkOutPlan, fetchWorkOutPlanWithId, updateWorkOutPlan } from "../../api/trainer/workOutPlan";

function AddWorkOutPlanPage() {
    const auth = useSelector((state) => state.auth)
    const workOutId = useParams().id
    const navigate = useNavigate()

    const [workout, setWorkout] = useState({
        _id: 0,
        name: "",
        description: "",
        duration_days: "",
        level: "Beginner",
        workout_type: "Mixed",
        exercises: [
            { name: "", sets: "", reps: "", duration_min: "", rest_sec: 60, met: "" },
        ],
    });

    const loadWorkOutPlan = async () => {
        try {
            const data = await fetchWorkOutPlanWithId(workOutId, auth.token)
            setWorkout(data)
        } catch (err) {
            SetErrors("Unable to get WorkOut Plan details")
            console.error("Error fetching WorkOut Plan:", err)
        }
    }

    useEffect(() => {
        if (workOutId) {
            loadWorkOutPlan();
        }
    }, [])

    const [errors, setErrors] = useState({});

    // Handle field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkout((prev) => ({ ...prev, [name]: value }));
    };

    // Handle exercise field change
    const handleExerciseChange = (index, field, value) => {
        const updated = workout.exercises.map((ex, i) =>
            i === index ? { ...ex, [field]: value } : ex
        );
        setWorkout((prev) => ({ ...prev, exercises: updated }));
    };

    // Add new exercise row
    const handleAddExercise = () => {
        setWorkout((prev) => ({
            ...prev,
            exercises: [
                ...prev.exercises,
                { name: "", sets: "", reps: "", duration_min: "", rest_sec: 60, met: "" },
            ],
        }));
    };

    // Remove exercise row
    const handleRemoveExercise = (index) => {
        setWorkout((prev) => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index),
        }));
    };

    const cancelAddPlan = () => {
        navigate("/admin/workoutplan")
    }

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!workout.name.trim()) {
            newErrors.name = "Workout name is required";
            valid = false;
        }

        if (!workout.duration_days || workout.duration_days <= 0) {
            newErrors.duration_days = "Duration is required";
            valid = false;
        }

        const hasInvalidExercise = workout.exercises.some(
            (ex) => !ex.name.trim() || !ex.met
        );
        if (hasInvalidExercise) {
            newErrors.exercises = "Each exercise must have a name and MET value";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const createWorkOutPlanDetails = async () => {
        try {
            console.log(workout);
            
            const data = await createWorkOutPlan(workout, auth.token);
            if (data.success) {
                setErrors("WorkOut Plan Created Succesfully")
            } else {
                console.log(data);
                setErrors(data);
            }
        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to create WorkOut Plan:", err);
        }
    };

    const updateWorkOutPlanDetails = async () => {
        try {
            const data = await updateWorkOutPlan(workout, auth.token);
            if (data.success) {
                setErrors("WorkOut Plan Updated Succesfully")
            } else {
                console.log(data);
                setErrors(data);
            }
        } catch (err) {
            setErrors("Something went wrong. Please try again.");
            console.error("Failed to update WorkOut Plan:", err);
        }
    };

    const SaveWorkOutPlan = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        if (workout._id == 0) {
            createWorkOutPlanDetails()
        } else {
            updateWorkOutPlanDetails()
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
            <div className='flex flex-col sm:flex-row justify-center sm:justify-around mb-3 items-center'>
                <h1 className='text-xl font-bold m-2 sm:m-0 '>Create WorkOut Plan</h1>
                <Link to='/admin/workoutplan' >
                    <span className="rounded-md text-blue-600 font-bold px-4 py-1.5 hover:bg-blue-50 transition-colors">Manage WorkOut Plans</span></Link>
            </div>

            <form onSubmit={SaveWorkOutPlan} className="space-y-2 m-5 mb-10">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Name *</label>
                        <input type="text" name="name" value={workout.name} required onChange={handleChange} className="border rounded-sm w-full p-1" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Duration (Days) *</label>
                        <input type="number" name="duration_days" required value={workout.duration_days} onChange={handleChange} className="border rounded-sm w-full p-1" />
                        {errors.duration_days && (<p className="text-red-500 text-sm">{errors.duration_days}</p>)}
                    </div>

                    <div>
                        <label className="block font-medium">Level</label>
                        <select name="level" value={workout.level} onChange={handleChange} className="border rounded-sm w-full p-1" >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Workout Type</label>
                        <select name="workout_type" value={workout.workout_type} onChange={handleChange} className="border rounded-sm w-full p-1" >
                            <option>Strength</option>
                            <option>Cardio</option>
                            <option>HIIT</option>
                            <option>Yoga</option>
                            <option>Mixed</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium">Description</label>
                        <textarea name="description" value={workout.description} onChange={handleChange} className="border rounded-sm w-full p-1" rows="3"
                        ></textarea>
                    </div>
                </div>

                {/* Exercises */}
                <div className="mt-3">
                    <h3 className="text-xl font-semibold mb-3">Exercises</h3>
                    {errors.exercises && (
                        <p className="text-red-500 text-sm">{errors.exercises}</p>
                    )}
                    {workout.exercises.map((ex, index) => (
                        <div key={index} className="grid grid-cols-6 gap-1 mb-2 border p-3 rounded-lg bg-gray-50" >
                            <input type="text" placeholder="Exercise Name *" value={ex.name} onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                                className="border rounded-sm p-1 col-span-2" />
                            <input type="number" placeholder="Sets" value={ex.sets} onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                                className="border rounded-sm p-1" />
                            <input type="number" placeholder="Reps" value={ex.reps} onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                                className="border rounded-sm p-1" />
                            <input type="number" placeholder="Duration (min)" value={ex.duration_min} onChange={(e) => handleExerciseChange(index, "duration_min", e.target.value)}
                                className="border rounded-sm p-1" />
                            <input type="number" placeholder="MET *" value={ex.met} onChange={(e) => handleExerciseChange(index, "met", e.target.value)}
                                className="border rounded-sm p-1" />
                            <button type="button" onClick={() => handleRemoveExercise(index)} className="bg-red-500 text-white px-3 rounded-sm hover:bg-red-600" >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddExercise} className="bg-blue-600 text-white px-4 py-2 rounded-sm mt-2 hover:bg-blue-700" >
                        + Add Exercise
                    </button>
                </div>

                {/* Submit */}
                <div className="mt-10 flex gap-4 items-center justify-center">
                    <button
                        type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        Save Plan
                    </button>
                    <button type="button" className="border border-transparent bg-white hover:border-blue-500 hover:bg-blue-50 px-4 py-2 rounded transition " onClick={cancelAddPlan}>
                        Cancel
                    </button>
                </div>

                {errors.length > 0 &&
                    <div>
                        <span className='text-red-400 p-5'>{errors}</span>
                    </div>}
            </form>

        </div>
    );
};

export default AddWorkOutPlanPage
