import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { useParams } from "react-router-dom";
import { fetchWorkOutPlanWithId } from "../../api/trainer/workOutPlan";
import { useSelector } from "react-redux";

const WorkoutPlanView = () => {
    const planId = useParams().id
    const [plan, setPlan] = useState();
    const auth = useSelector((state) => state.auth)

    useEffect(() => {
        fetchWorkOutPlan();
    }, [])

    const fetchWorkOutPlan = async () => {
        try {
            const result = await fetchWorkOutPlanWithId(planId, auth.token);
            if (result.data) {
              setPlan(result.data);
            }
        } catch (err) {
            console.error("Error fetching Exercise Master:", err);
        }
    }

    if (!plan) return <p className="text-gray-500">No workout plan available.</p>;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                    <p className="text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Duration:</strong> {plan.duration_days} days</div>
                    <div><strong>Estimated Calories Burned:</strong> {plan.estimated_calories_burned} kcal</div>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Exercises</CardTitle>
                </CardHeader>

                <CardContent>
                    <table className="min-w-full border-collapse border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">Exercise</th>
                                <th className="border p-2 text-center">Sets</th>
                                <th className="border p-2 text-center">Reps</th>
                                <th className="border p-2 text-center">Duration (min)</th>
                                <th className="border p-2 text-center">Rest (sec)</th>
                                <th className="border p-2 text-center">MET</th>
                                <th className="border p-2 text-center">Calories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plan.exercises?.map((ex, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border p-2">{ex.exercise_id?.name || "N/A"}</td>
                                    <td className="border p-2 text-center">{ex.sets || "-"}</td>
                                    <td className="border p-2 text-center">{ex.reps || "-"}</td>
                                    <td className="border p-2 text-center">{ex.duration_min || "-"}</td>
                                    <td className="border p-2 text-center">{ex.rest_sec || "-"}</td>
                                    <td className="border p-2 text-center">{ex.met}</td>
                                    <td className="border p-2 text-center">
                                        {((ex.met * ex.duration_min * 3.5 * 70) / 200).toFixed(1)} kcal
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-right font-semibold mt-4">
                        Total Burn: {plan.estimated_calories_burned} kcal
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkoutPlanView;
