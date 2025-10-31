import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllFitnessProgram } from "../api/admin/fitnessPrograms";
import { useSelector } from "react-redux";
import LogInHeader from "../components/LogInHeader";
import PaymentButton from "../components/user/PaymentButton";

export default function PaymentPlansPage() {
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const result = await fetchAllFitnessProgram(auth.token);
                if (result.success) {
                    setPlans(result.allPaymentPlan);
                }
            } catch (error) {
                console.error("Error fetching payment plans:", error);
            }
        };
        fetchPlans();
    }, []);

    if (!plans.length)
        return (
            <div className="text-center text-gray-500 py-10">Loading plans...</div>
        );

    return (
        <div>
            <LogInHeader />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    Choose Your Fitness Plan
                </h1>

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan._id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-800 to-blue-500 text-white text-center py-6 rounded-t-2xl">
                                <h2 className="text-2xl font-semibold">{plan.name}</h2>
                                <p className="text-sm mt-1 opacity-90">{plan.description}</p>
                                <p className="text-3xl font-bold mt-4">
                                    ₹{plan.price}
                                    <span className="text-sm font-medium opacity-80">
                                        /{Math.round(plan.duration_days / 30)} mo
                                    </span>
                                </p>
                            </div>

                            {/* Features */}
                            <div className="p-6 flex-1">
                                <h3 className="font-semibold text-gray-700 mb-3">
                                    What’s Included
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {plan.features?.trainers?.map((t, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="text-green-500 mr-2">✔</span>
                                            {t.count} {t.trainer_type} coach
                                            {t.count > 1 ? "es" : ""}
                                        </li>
                                    ))}

                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✔</span>
                                        {plan.features.support_level} Support
                                    </li>

                                    {plan.features.diet_plan_access && (
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✔</span>
                                            Diet Plan Access
                                        </li>
                                    )}

                                    {plan.features.workout_plan_access && (
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✔</span>
                                            Workout Plan Access
                                        </li>
                                    )}

                                    {plan.features.yoga_plan_access && (
                                        <li className="flex items-center">
                                            <span className="text-green-500 mr-2">✔</span>
                                            Yoga Plan Access
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Footer */}                           
                            <div className="text-center pb-6">
                                <button                                    
                                       onClick={() => navigate(`/login/${plan._id}`)}
                                    className="bg-indigo-800 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200"
                                >
                                    Subscribe Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
