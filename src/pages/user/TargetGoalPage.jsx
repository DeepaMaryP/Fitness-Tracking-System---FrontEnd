import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createTargetGoal, fetchTargetGoalWithUserId } from "../../api/user/targetGoal";
import { fetchUserProfileWithId } from "../../api/user/userProfile";

const TargetGoalPage = ({ }) => {

    const [profile, setProfile] = useState({
        height_cm: "",
        weight_kg: "",
        bmi: ""
    });

    const [targetGoal, setTargetGoal] = useState({
        userId: null,
        goalType: "",
        targetWeight: "",
        duration_days: "",
        dailyCalories: "",
    });

    const auth = useSelector((state) => state.auth)
    const [error, setError] = useState("");

    useEffect(() => {
        fetchGoal()
        fetchProfile()
    }, [])

    useEffect(() => {
        calculateDailyCalories();
    }, [targetGoal.goalType, targetGoal.targetWeight, targetGoal.duration_days])

    const fetchProfile = async () => {
        try {
            const result = await fetchUserProfileWithId(auth.userId, auth.token)
            if (result.success && result.data) {
                const profileData = result.data;
                calculateBMI(profileData)
                setProfile(profileData)
            }
        } catch (err) {
            console.error("Error fetching UserProfile:", err)
            setError(`Error fetching UserProfile:${err}`)
        }
    };

    const fetchGoal = async () => {
        try {
            const result = await fetchTargetGoalWithUserId(auth.userId, auth.token)
            if (result.success && result.data) {
                setTargetGoal({
                    userId: result.data.userId || null,
                    goalType: result.data.goal_type || "",
                    targetWeight: result.data.target_weight || "",
                    duration_days: result.data.duration_days || "",
                    dailyCalories: result.data.daily_calorie_target || ""                  
                });
            }
        } catch (err) {
            console.error("Error fetching Goal:", err)
            setError(`Error fetching Goal:${err}`)
        }
    };

    const calculateBMI = (profile) => {
        const bmi = (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1);
        profile.bmi = bmi
        let goalType
        if (bmi > 25) goalType = "Weight Loss";
        else if (bmi < 18.5) goalType = "Weight Gain";
        else goalType = "Maintain";

        setTargetGoal(prev => ({
            ...prev,
            goalType: goalType
        }))
    }

    const calculateDailyCalories = () => {   // Calculate daily calorie target
        if (!targetGoal.targetWeight || !targetGoal.duration_days) {
            setTargetGoal(prev => ({ ...prev, dailyCalories: "" }))
            return;
        }

        const maintenanceCalories = 22 * profile.weight_kg; // Rough maintenance baseline
        const calorieDiffPerDay = ((profile.weight_kg - targetGoal.targetWeight) * 7700) / targetGoal.duration_days;

        let dailyTarget;
        if (targetGoal.goalType === "Weight Loss") dailyTarget = maintenanceCalories - calorieDiffPerDay;
        else if (targetGoal.goalType === "Weight Gain") dailyTarget = maintenanceCalories + Math.abs(calorieDiffPerDay);
        else dailyTarget = maintenanceCalories;

        setTargetGoal(prev => ({
            ...prev, dailyCalories: Math.round(dailyTarget)
        }))
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTargetGoal(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    }

    // Submit data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                userId: auth.userId,
                goal_type: targetGoal.goalType,
                target_weight: Number(targetGoal.targetWeight),
                duration_days: Number(targetGoal.duration_days),
                daily_calorie_target: targetGoal.dailyCalories,
            };
            const data = await createTargetGoal(payload, auth.token)
            if (data.success) {
                console.log("Goal Created Succesfully")
                setError("Goal Created Succesfully")
            } else {
                setError(data);
            }
        } catch (err) {
            console.error("Error saving goal:", err);
            setError(err.response?.data?.message || "Failed to create goal");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
                Set Your Fitness Goal
            </h2>

            {/* User Stats */}
            <div className="bg-blue-50 rounded-lg p-4 mb-5 text-center">
                <p className="text-lg font-medium">
                    Current Weight: <span className="font-bold">{profile.weight_kg} kg</span>
                </p>
                <p className="text-lg font-medium">
                    BMI: <span className="font-bold">{profile.bmi}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Goal Type</label>
                    <select value={targetGoal.goalType}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2" >
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Weight Gain">Weight Gain</option>
                        <option value="Maintain">Maintain</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Target Weight (kg)</label>
                    <input type="number" value={targetGoal.targetWeight} onChange={handleChange} name="targetWeight"
                        className="w-full border rounded-lg p-2" required />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Duration (days)</label>
                    <input type="number" value={targetGoal.duration_days} onChange={handleChange} name="duration_days"
                        className="w-full border rounded-lg p-2" required />
                </div>

                {/* Daily Calorie Target */}
                {targetGoal.dailyCalories && (
                    <div className="bg-green-50 rounded-lg p-3 text-center font-semibold text-green-700">
                        Daily Calorie Target: {targetGoal.dailyCalories} kcal/day
                    </div>
                )}

                {error && <p className="text-red-500 text-md text-center">{error}</p>}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-500"
                >
                    Save Target Goal
                </button>
            </form>
        </div>
    );
};

export default TargetGoalPage;
