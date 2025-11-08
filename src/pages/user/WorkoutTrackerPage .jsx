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
            console.error("Error fetching workout plan:", err);
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
    <div className="p-4 sm:p-6 mt-8 space-y-6 max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-xl">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
            Add / Edit Workout Tracker
          </CardTitle>
          <Button
            type="button"
            onClick={() => navigate("/user/workouthistory")}
            className="bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 text-sm sm:text-base px-4 py-2 rounded-md w-full sm:w-auto"
          >
            View Workout History →
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workout Plan */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Workout Plan
              </label>
              <Link
                to={`/user/userworkoutplanview/${workOutPlan?.workout_plan_id?._id}`}
                className="text-blue-500 hover:underline break-words text-sm sm:text-base"
              >
                {workOutPlan?.workout_plan_id?.name || "No plan selected"}
              </Link>
            </div>

            {/* Date and Find */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-8 gap-4 items-end">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Date
                </label>
                <Input
                  type="date"
                  value={workoutTracker.date}
                  onChange={handleChange}
                  name="date"
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                onClick={findTrackers}
                className="col-span-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2"
              >
                Find
              </Button>
            </div>

            {/* Exercises Section */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 text-base sm:text-lg">
                Exercises
              </h3>

              <div className="relative w-full mb-4">
                <Input
                  placeholder="Search exercise"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                {searchTerm && (
                  <ul className="absolute bg-white border w-full max-h-40 overflow-y-auto mt-1 rounded-md shadow z-10 text-sm">
                    {exerciseMaster?.filter((e) =>
                      e.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length > 0 ? (
                      exerciseMaster
                        .filter((e) =>
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
                        ))
                    ) : (
                      <li className="px-3 py-2 text-gray-500">No match found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Exercises Table */}
            {workoutTracker.exercises?.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border px-2 py-2 text-left">Exercise</th>
                      <th className="border px-2 py-2">Sets</th>
                      <th className="border px-2 py-2">Reps</th>
                      <th className="border px-2 py-2">Duration (min)</th>
                      <th className="border px-2 py-2">MET</th>
                      <th className="border px-2 py-2">Calories</th>
                      <th className="border px-2 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutTracker.exercises.map((exercise, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-2 py-1 truncate max-w-[200px]" title={exercise.name}>
                          {exercise.name}
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            value={exercise.sets}
                            name="sets"
                            onChange={(e) =>
                              handleExerciseChange(idx, "sets", e.target.value)
                            }
                            className="w-full border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleExerciseChange(idx, "reps", e.target.value)
                            }
                            className="w-full border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <input
                            type="number"
                            min="0"
                            value={exercise.duration_min}
                            onChange={(e) =>
                              handleExerciseChange(
                                idx,
                                "duration_min",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-1 py-0.5 text-center"
                          />
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {exercise.met}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {exercise.calories_burned}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(idx)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No exercises added yet.
              </p>
            )}

            {/* Total Calories */}
            <div className="text-right font-semibold text-sm sm:text-base">
              Total Calories Burned:{" "}
              <span className="text-blue-700">
                {workoutTracker.total_calories_burned}
              </span>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-center text-sm sm:text-base">
                {error}
              </p>
            )}

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md text-sm sm:text-base"
            >
              Save Workout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTrackerPage;
