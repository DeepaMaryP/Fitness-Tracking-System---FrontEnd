import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Buttons";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { fetchAllExerciseMaster } from "../../api/trainer/exerciseMaster";
import { createWorkOutTracker, fetchUserWorkOutTracker } from "../../api/user/workoutTracker.";
import { fetchUserWorkOutPlan } from "../../api/trainer/userWorkOutPlan";

const WorkoutTrackerPage = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)
    const [error, setError] = useState("");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [workoutTracker, setWorkOutTracker] = useState(
        {
            workout_plan_id: null,
            date: today,
            exercises: [],
            total_calories_burned: ""
        });

    const [exerciseMaster, setexerciseMaster] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [workOutPlan, setWorkOutPlan] = useState();

    useEffect(() => {
        fetchWorkoutPlan();
        fetchExercises();
        fetchUserWorkoutTrackers(workoutTracker.date)
    }, []);

    const fetchWorkoutPlan = async () => {
        try {
            const result = await fetchUserWorkOutPlan(auth.userId, auth.token);            
            if (result.success && result.data) {                
               setWorkOutPlan(result.data)
            }
        } catch (err) {
            console.error("Error fetching workout plans:", err);
        }
    };

    const fetchUserWorkoutTrackers = async (date) => {
        try {
            setWorkOutTracker((prev) => ({ ...prev, exercises: [] }))
            const result = await fetchUserWorkOutTracker(auth.userId, date, auth.token);
            if (result.success && result.data) {
                const tracker = result.data
                if (tracker.date) {
                    tracker.date = new Date(tracker.date).toISOString().split("T")[0];
                }
                setWorkOutTracker(result.data);
            }
        } catch (err) {
            console.error("Error fetching workout tracker:", err);
        }
    };

    const fetchExercises = async () => {
        try {
            const result = await fetchAllExerciseMaster(auth.token);
            setexerciseMaster(result);
        } catch (err) {
            console.error("Error fetching Exercise Master:", err);
        }
    };

    const handleAddExercise = (exercise) => {
        const newExercise = { name: exercise.name, sets: "", reps: "", duration_min: "", met: exercise.met, calories_burned: "" }
        const updated = [...workoutTracker.exercises]
        updated.push(newExercise)
        setWorkOutTracker((prev) => ({
            ...prev,
            exercises: updated
        }))

        setSearchTerm("");
        setError("")
    };

    const handleRemoveExercise = (workOutIndex) => {
        const updated = [...workoutTracker.exercises];
        updated.splice(workOutIndex, 1);
        const total = updated.reduce((sum, e) => sum + Number(e.calories_burned || 0), 0);

        setWorkOutTracker((prev) => ({
            ...prev,
            exercises: updated,
            total_calories_burned: total.toFixed(1)
        }))
        setError("")
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setWorkOutTracker((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleExerciseChange = (workOutIndex, field, value) => {
        const exerciseList = [...workoutTracker.exercises]
        const curExercise = exerciseList[workOutIndex];
        curExercise[field] = value

        // Recalculate calories when met/duration changes
        if (field === "duration_min") {
            const dur = parseFloat(value || 0);
            const met = parseFloat(curExercise.met || 0);
            const calories_burned = ((met * 3.5 * 70 * dur) / 200).toFixed(1); // 70kg default            
            curExercise.calories_burned = calories_burned
        }
        const total = exerciseList.reduce((sum, e) => sum + Number(e.calories_burned || 0), 0);
        setWorkOutTracker((prev) => ({
            ...prev,
            exercises: exerciseList,
            total_calories_burned: total.toFixed(1)
        }))
        setError("")
    };

    const validateWorkOutTracker = (tracker) => {
        const errors = [];

        if (!tracker.user_id) {
            errors.push("User ID is missing.");
        }

        const today = new Date()
        const trackerDate = new Date(tracker.date)

        if (trackerDate > today) {
            errors.push("Date cannot be greater than today");
        }

        if (tracker?.exercises.length == 0) {
            errors.push("Please add exercise before saving.");
            return errors;
        }

        tracker.exercises.forEach((exercise, mealIndex) => {

            if (!exercise.exercise_id && !exercise.name) {
                errors.push(`Exercise name or ID missing in (row ${mealIndex + 1}).`);
            }

            if (!exercise.duration_min) {
                errors.push(`Duration missing in (${exercise.name || "exercise"})`);
            }
            if (!exercise.met) {
                errors.push(`met missing in (${exercise.name || "exercise"})`);
            }

            if (exercise.calories_burned === undefined || exercise.calories_burned < 0) {
                errors.push(`Calories missing or invalid in (${exercise.name || "exercise"})`);
            }
        });

        return errors;
    };

    const findTrackers = () => {
        const date = workoutTracker.date
        fetchUserWorkoutTrackers(date);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTracker = { user_id: auth.userId, ...workoutTracker }
            const errors = validateWorkOutTracker(newTracker);
            if (errors.length > 0) {
                setError(errors.join("\n"))
                return;
            }

            const data = await createWorkOutTracker(newTracker, auth.token)
            if (data.success) {
                console.log("WorkOut Tracked Succesfully")
                setError("WorkOut Tracked Succesfully")
            } else {
                setError(data);
            }
        } catch (err) {
            console.error("Error in WorkOut Tracking:", err);
            setError(err.response?.data?.message || "Failed to Track WorkOut");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle> Add / Edit Workout Tracker</CardTitle>
                    <Button
                        type="button"
                        onClick={() => navigate("/user/workouthistory")}
                        className="bg-blue-600 text-blue-700 border border-blue-400 hover:bg-blue-50"
                    >
                        View Workout History →
                    </Button>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Workout Plan */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Workout Plan</label>
                            <Link to={`/user/userworkoutplanview/${workOutPlan?.workout_plan_id?._id}`}>{workOutPlan?.workout_plan_id?.name}</Link>
                        </div>

                        <div className="grid grid-cols-8 items-end space-x-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <Input type="date" value={workoutTracker.date} onChange={handleChange} name="date" />
                            </div>
                            <Button type="button" className="col-span-1" onClick={findTrackers}> Find </Button>
                        </div>

                        {/* Exercises Section */}
                        <div>
                            <h3 className="font-semibold mb-2">Exercises</h3>
                            <div className="grid mb-2">
                                <div className="relative w-full">
                                    <Input placeholder="Search exercise" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); }} />
                                    {searchTerm && (
                                        <ul className="absolute bg-white border w-full max-h-40 overflow-y-auto mt-1 rounded shadow z-10">
                                            {exerciseMaster?.filter((e) =>
                                                e.name.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                                .map((e) => (
                                                    <li
                                                        key={e._id}
                                                        onClick={() => handleAddExercise(e)}
                                                        className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                                                    >
                                                        {e.name}
                                                    </li>
                                                ))}
                                            {exerciseMaster.filter((e) =>
                                                e.name.toLowerCase().includes(searchTerm.toLowerCase())
                                            ).length === 0 && (
                                                    <li className="px-3 py-1 text-gray-500">
                                                        No match
                                                        {/* <button
                                                            className="text-blue-600 underline"
                                                        // onClick={() =>
                                                        //     setNewExercise({ ...newFood, name: searchTerm })
                                                        // }
                                                        >
                                                            Add “{searchTerm}”
                                                        </button> */}
                                                    </li>
                                                )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table of Exercises */}
                        {workoutTracker.exercises?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 text-left">Exercise</th>
                                            <th className="border px-2 py-1">Sets</th>
                                            <th className="border px-2 py-1">Reps</th>
                                            <th className="border px-2 py-1">Duration (min)</th>
                                            <th className="border px-2 py-1">MET</th>
                                            <th className="border px-2 py-1">Calories</th>
                                            <th className="border px-2 py-1">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workoutTracker.exercises?.map((exercise, workOutIndex) => {
                                            return (
                                                <tr key={workOutIndex}>
                                                    <td className="border px-2 py-1">{exercise.name}</td>
                                                    <td className="border px-2 py-1 w-25">
                                                        <input type="number" min="0" placeholder="Sets" value={exercise.sets} name="sets" onChange={(e) => handleExerciseChange(workOutIndex, "sets", e.target.value)}
                                                            className="w-full border rounded px-1 py-0.5" />
                                                    </td>
                                                    <td className="border px-2 py-1 w-25">
                                                        <input type="number" min="0" value={exercise.reps} onChange={(e) => handleExerciseChange(workOutIndex, "reps", e.target.value)}
                                                            className="w-full border rounded px-1 py-0.5" />
                                                    </td>
                                                    <td className="border px-2 py-1 w-25 text-center">
                                                        <input type="number" min="0" value={exercise.duration_min} onChange={(e) => handleExerciseChange(workOutIndex, "duration_min", e.target.value)}
                                                            className="w-full border rounded px-1 py-0.5" />
                                                    </td>
                                                    <td className="border px-2 py-1 w-25 text-center">
                                                        {exercise.met}
                                                    </td>
                                                    <td className="border px-2 py-1 w-25 text-center">
                                                        {exercise.calories_burned}
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">
                                                        <button type="button"
                                                            onClick={() => handleRemoveExercise(workOutIndex)}
                                                            className="text-red-600 hover:text-red-800 font-semibold" >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">
                                No exercises are added yet
                            </p>
                        )}

                        {/* Total Calories */}
                        <div className="text-right font-semibold">
                            Total Calories Burned: {workoutTracker.total_calories_burned}
                        </div>

                        {error && <p className="text-red-500 text-md text-center">{error}</p>}

                        {/* Save */}
                        <Button type="submit" className="w-full mt-4">
                            Save Workout
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkoutTrackerPage;
