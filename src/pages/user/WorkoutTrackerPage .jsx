import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { fetchAllWorkOutPlan } from "../../api/trainer/workOutPlan";

const WorkoutTrackerPage = () => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)
    const userId = auth.userId
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [formData, setFormData] = useState({
        workout_plan_id: "",
        date: new Date().toISOString().split("T")[0],
        exercises: [
            { name: "", sets: "", reps: "", duration_min: "", met: "", calories_burned: "" },
        ],
        total_calories_burned: 0,
    });

    useEffect(() => {
        fetchWorkoutPlans();
    }, []);

    const fetchWorkoutPlans = async () => {
        try {
            const result = await fetchAllWorkOutPlan(auth.token);
            if (result.success && result.data) {
                setWorkoutPlans(result.data);
            }
        } catch (err) {
            console.error("Error fetching workout plans:", err);
        }
    };

    const handleExerciseChange = (index, field, value) => {
        const updated = [...formData.exercises];
        updated[index][field] = value;

        // Recalculate calories when met/duration changes
        if (field === "duration_min" || field === "met") {
            const dur = parseFloat(updated[index].duration_min || 0);
            const met = parseFloat(updated[index].met || 0);
            updated[index].calories_burned = ((met * 3.5 * 70 * dur) / 200).toFixed(1); // 70kg default
        }

        const total = updated.reduce((sum, e) => sum + Number(e.calories_burned || 0), 0);
        setFormData({ ...formData, exercises: updated, total_calories_burned: total.toFixed(1) });
    };

    const addExercise = () => {
        setFormData({
            ...formData,
            exercises: [
                ...formData.exercises,
                { name: "", sets: "", reps: "", duration_min: "", met: "", calories_burned: "" },
            ],
        });
    };

    const removeExercise = (index) => {
        const updated = formData.exercises.filter((_, i) => i !== index);
        const total = updated.reduce((sum, e) => sum + Number(e.calories_burned || 0), 0);
        setFormData({ ...formData, exercises: updated, total_calories_burned: total.toFixed(1) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/userWorkoutTracker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, ...formData }),
            });
            if (res.ok) {
                alert("Workout saved successfully!");
                // Reset form
                setFormData({
                    workout_plan_id: "",
                    date: new Date().toISOString().split("T")[0],
                    exercises: [{ name: "", sets: "", reps: "", duration_min: "", met: "", calories_burned: "" }],
                    total_calories_burned: 0,
                });
            } else {
                alert("Error saving workout!");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle> Add / Edit Workout Tracker</CardTitle>
                    <Button
                        type="button"
                        onClick={() => navigate("/user/workout-history")}
                        className="bg-blue-600 text-blue-700 border border-blue-400 hover:bg-blue-50"
                    >
                        View Workout History →
                    </Button>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Workout Plan */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Workout Plan</label>
                            <select
                                value={formData.workout_plan_id}
                                onChange={(e) => setFormData({ ...formData, workout_plan_id: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="">Select plan</option>
                                {workoutPlans.map((plan) => (
                                    <option key={plan._id} value={plan._id}>
                                        {plan.plan_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        {/* Exercises Section */}
                        <div>
                            <h3 className="font-semibold mb-2">Exercises</h3>
                            {formData.exercises.map((ex, index) => (
                                <div key={index} className="grid grid-cols-6 gap-2 mb-2">
                                    <Input
                                        placeholder="Name"
                                        value={ex.name}
                                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Sets"
                                        value={ex.sets}
                                        onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Reps"
                                        value={ex.reps}
                                        onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Duration (min)"
                                        value={ex.duration_min}
                                        onChange={(e) => handleExerciseChange(index, "duration_min", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="MET"
                                        value={ex.met}
                                        onChange={(e) => handleExerciseChange(index, "met", e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Calories"
                                        value={ex.calories_burned}
                                        readOnly
                                    />
                                    {index > 0 && (
                                        <Button
                                            type="button"
                                            onClick={() => removeExercise(index)}
                                            className="col-span-6 bg-red-100 text-red-700 hover:bg-red-200"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" onClick={addExercise}>
                                + Add Exercise
                            </Button>
                        </div>

                        {/* Total Calories */}
                        <div className="text-right font-semibold">
                            Total Calories Burned: {formData.total_calories_burned}
                        </div>

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
