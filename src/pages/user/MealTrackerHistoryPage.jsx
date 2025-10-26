import React from "react";
import CalorieConsumptionGraph from "../../components/user/CalorieConsumptionGraph";
import { useSelector } from "react-redux";
import MealTrackerCard from "../../components/user/MealTrackerCard";

const MealTrackerHistoryPage = () => {
    const auth = useSelector((state) => state.auth);
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Previous Food Tracker</h1>

            {/* Graph Section */}
            <CalorieConsumptionGraph userId={auth.userId} />

            {/* Card Section */}
            <MealTrackerCard userId={auth.userId} />

        </div>
    );
};

export default MealTrackerHistoryPage;