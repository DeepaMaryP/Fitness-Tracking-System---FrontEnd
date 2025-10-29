import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { useParams } from "react-router-dom";
import { fetchDietPlanWithId } from "../../api/trainer/dietPlan";
import { useSelector } from "react-redux";

export default function DietPlanView() {
    const dietPlanId = useParams().id
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state) => state.auth)

    useEffect(() => {
        fetchDietPlan();
    }, []);

    const fetchDietPlan = async () => {
        try {
            const result = await fetchDietPlanWithId(dietPlanId, auth.token);
            if (result.data) {
                setPlan(result.data);               
                setLoading(false)
            }
        } catch (err) {
            console.error("Error fetching Diet Plan:", err);
        }
    }

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (!plan) return <p className="text-center py-10">Diet Plan not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <h1 className="text-2xl font-semibold">{plan.plan_name}</h1>
                    <p className="text-gray-500 mt-1">Goal: {plan.goal_type}</p>
                </CardHeader>

                <CardContent>
                    {/* Summary Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 p-3 rounded-xl text-center">
                            <p className="font-semibold">Calories</p>
                            <p>{plan.total_calories} kcal</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl text-center">
                            <p className="font-semibold">Protein</p>
                            <p>{plan.macros.protein_g} g</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl text-center">
                            <p className="font-semibold">Carbs</p>
                            <p>{plan.macros.carbs_g} g</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl text-center">
                            <p className="font-semibold">Fat</p>
                            <p>{plan.macros.fat_g} g</p>
                        </div>
                    </div>

                    {/* Meals Section */}
                    {Object.entries(plan.meals).map(([mealType, mealData]) => (
                        <div
                            key={mealType}
                            className="mb-8 border border-gray-200 rounded-xl overflow-hidden"
                        >
                            <div className="bg-gray-100 px-4 py-2 font-semibold text-lg">
                                {mealType}
                            </div>

                            {mealData.food_items?.length > 0 ? (
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-2 border">Food</th>
                                            <th className="p-2 border">Quantity</th>
                                            <th className="p-2 border">Calories</th>
                                            <th className="p-2 border">Protein (g)</th>
                                            <th className="p-2 border">Carbs (g)</th>
                                            <th className="p-2 border">Fat (g)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mealData.food_items.map((item, i) => (
                                            <tr key={i}>
                                                <td className="p-2 border">{item.baseFood?.name || "—"}</td>
                                                <td className="p-2 border">
                                                    {item.quantity} {item.unit}
                                                </td>
                                                <td className="p-2 border">{item.calories}</td>
                                                <td className="p-2 border">{item.protein_g}</td>
                                                <td className="p-2 border">{item.carbs_g}</td>
                                                <td className="p-2 border">{item.fat_g}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="p-4 text-gray-500 italic text-sm">
                                    No food items added.
                                </p>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
