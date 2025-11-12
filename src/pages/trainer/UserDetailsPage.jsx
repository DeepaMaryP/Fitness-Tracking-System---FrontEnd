import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/Card";

import { useSelector } from "react-redux";
import { fetchAllDietPlan } from "../../api/trainer/dietPlan";
import { fetchAllWorkOutPlan } from "../../api/trainer/workOutPlan";
import { fetchTargetGoalAndStatOfUser } from "../../api/user/targetGoal";
import { fetchUserProfileWithUserId } from "../../api/user/userProfile";
import { calculateAge, calculateUserProgress } from "../../components/utils";
import AssignDietPlan from "../../components/trainer/AssignDietPlan";
import { fetchUserDietPlan } from "../../api/trainer/userDietPlan";
import AssignWorkOutPlan from "../../components/trainer/AssignWorkOutPlan";
import { fetchUserWorkOutPlan } from "../../api/trainer/userWorkOutPlan";
import CalorieConsumptionGraph from "../../components/user/CalorieConsumptionGraph";
import BurntCalorieGraph from "../../components/user/BurntCalorieGraph";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserDetailsPage = () => {
    const [profile, setProfile] = useState(null);
    const [goal, setGoal] = useState(null);
    const [userDietPlan, setUserDietPlan] = useState(null);
    const [alldietPlans, setAllDietPlans] = useState(null);
    const [allWorkoutPlans, setAllWorkoutPlans] = useState(null);
    const [userWorkoutPlan, setUserWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state) => state.auth)
    const userId = useParams().id

    useEffect(() => {

        const fetchUserDetails = async () => {
            try {
                const [profileRes, goalRes, alldietRes, dietRes, allWorkOutRes, workoutRes] = await Promise.all([
                    fetchUserProfileWithUserId(userId, auth.token),
                    fetchTargetGoalAndStatOfUser(userId, auth.token),
                    fetchAllDietPlan(auth.token),
                    fetchUserDietPlan(userId, auth.token),
                    fetchAllWorkOutPlan(auth.token),
                    fetchUserWorkOutPlan(userId, auth.token),
                ]);

                setProfile(profileRes.data);
                setGoal(goalRes?.data);
                setAllDietPlans(alldietRes.data);
                setUserDietPlan(dietRes.data);
                setAllWorkoutPlans(allWorkOutRes.data)
                setUserWorkoutPlan(workoutRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [userId]);

    if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
    if (!profile) return <div className="text-center py-10 text-gray-600">User not found.</div>;

    const userGoal = {
        goal_type: goal?.goal_type, starting_weight: goal?.start_weight, latest_weight: goal?.current_weight, target_weight: goal?.target_weight
    };
    const progress = calculateUserProgress(userGoal);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Link to="/trainer" className="text-blue-600 hover:underline">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-2xl font-semibold text-gray-800">{profile.userId?.name}</h1>
            </div>

            {/* Profile + Goal Summary */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                        <p><strong>Email:</strong> {profile.userId?.email}</p>
                        { profile?.dob && <p><strong>Age:</strong> {calculateAge(profile?.dob)}</p> }
                        <p><strong>Gender:</strong> {profile.gender}</p>
                        <p><strong>Height(cm):</strong> {profile.height_cm}</p>
                        <p><strong>Goal Type:</strong> {goal?.goal_type || ""} </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fitness Goal & Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                        <p><strong>Starting Weight:</strong> {goal?.start_weight|| ""} kg</p>
                        <p><strong>Current Weight:</strong> {goal?.current_weight|| ""} kg</p>
                        <p><strong>Target Weight:</strong> {goal?.target_weight|| ""} kg</p>
                        <p><strong>Duration:</strong> {goal?.duration_days || ""} days</p>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded">
                                <div
                                    className="h-2 bg-green-500 rounded"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plans Section */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex justify-between">
                        <CardTitle>Diet Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        <AssignDietPlan dietPlans={alldietPlans} userId={userId} currUserDietPlan={userDietPlan} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex justify-between">
                        <CardTitle>Workout Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        <AssignWorkOutPlan workOutPlans={allWorkoutPlans} userId={userId} currWorkOutPlan={userWorkoutPlan} />
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>🍽️ Calorie Intake</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CalorieConsumptionGraph userId={userId} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>🔥 Calories Burned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BurntCalorieGraph userId={userId} />
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Logs Link */}
            <div className="text-center mt-6">
                <Link
                    to={`/trainer/user/mealtracker/${userId}`}
                    className="text-blue-600 hover:underline"
                >
                    View Detailed Food & Workout Logs →
                </Link>
            </div>
        </div>
    );
};

export default UserDetailsPage;
