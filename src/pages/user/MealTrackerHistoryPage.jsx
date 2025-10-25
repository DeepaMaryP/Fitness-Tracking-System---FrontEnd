import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

import { fetchFoodTrackerByDates } from "../../api/user/foodtracker";
import { getFormattedDate, getFormattedDateToDisplay } from "../../components/utils";
import CalorieConsumptionGraph from "../../components/user/CalorieConsumptionGraph";

const MealTrackerHistoryPage = () => {
    const [foodHistory, setFoodHistory] = useState([])
    const [expandedDay, setExpandedDay] = useState(null);
    const [cardRange, setCardRange] = useState(3); // 3,7,custom
    const [customStart, setCustomStart] = useState(null);
    const [customEnd, setCustomEnd] = useState(null);
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        filterCardFoodTracks(3); // 3 days before by default - cards       
    }, [auth.userId])

    // Toggle card expand/collapse
    const toggleExpand = (date) => {
        setExpandedDay(expandedDay === date ? null : date);
    };

    const fetchFoodTrackerLogs = async (userId, startDate, endDate) => {
        try {
            const formattedStart = getFormattedDate(startDate)
            const formattedEnd = getFormattedDate(endDate)

            const result = await fetchFoodTrackerByDates(userId, formattedStart, formattedEnd, auth.token);
            if (result.success && result.data) {
                setFoodHistory(result.data);
            }
        } catch (err) {
            console.warn("No Food tracker found");
            setFoodHistory([])
        }
    };

    // Filter cards based on selection
    const filterCardFoodTracks = (range) => {
        setCardRange(range)

        if (range === "custom") {
            if (customStart && customEnd) {
                customStart.setHours(0, 0, 0, 0);   // start of day    
                customEnd.setHours(23, 59, 59, 999); // end of day       
                const diffDays = (customEnd - customStart) / (1000 * 60 * 60 * 24);
                if (diffDays > 7) { alert("Date range should not exceed 7 days"); setCustomStart(""); return; }
            }
        } else {
            const endDate = new Date();
            const startDate = new Date(endDate);

            startDate.setDate(endDate.getDate() - range);
            fetchFoodTrackerLogs(auth.userId, startDate, endDate);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Previous Food Tracker</h1>

            {/* Graph Section */}
            <CalorieConsumptionGraph userId = {auth.userId}/>
        
            {/* Cards Range Selector */}
            <div className="mb-4 flex gap-2 items-center">
                <label className="font-medium">Show Logs:</label>
                {[3, 7, "custom"].map((range) => (
                    <button
                        key={range}
                        onClick={() => { filterCardFoodTracks(range) }}

                        className={`px-3 py-1 rounded ${cardRange === range ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {range === "custom" ? `Custom Range (Max 7 Days)` : `Last ${range} Days`}
                    </button>
                ))}
            </div>

            {/* Custom Date Pickers */}
            {cardRange === "custom" && (
                <div className="mb-6 flex gap-4 items-center">
                    <div>
                        <label className="block mb-1">Start Date:</label>
                        <DatePicker
                            selected={customStart}
                            onChange={(date) => setCustomStart(date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select start date"
                            className="border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">End Date:</label>
                        <DatePicker
                            selected={customEnd}
                            onChange={(date) => setCustomEnd(date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select end date"
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="self-end">
                        <button className="bg-blue-600 px-4 py-1 rounded-lg" onClick={() => { filterCardFoodTracks('custom') }}>Find</button>
                    </div>
                </div>
            )}

            {foodHistory?.map((day) => (
                <div key={day.date} className="border rounded-lg mb-4 shadow-sm">
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
                        onClick={() => toggleExpand(day.date)}
                    >
                        <div>
                            <p className="font-semibold">{getFormattedDateToDisplay(day.date)}</p>
                            <p className="text-sm text-gray-600">
                                Calories: {day.total_calories} kcal | Protein: {day.total_protein_g}g | Carbs: {day.total_carbs_g}g | Fat: {day.total_fat_g}g
                            </p>
                        </div>
                        <div>{expandedDay === day.date ? "▲" : "▼"}</div>
                    </div>

                    {expandedDay === day.date && (
                        <div className="p-4">
                            {day.meals.map((meal) => (
                                <div key={meal.meal_type.type} className="mb-4">
                                    <h3 className="font-semibold mb-2">{meal.meal_type.type}</h3>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-1">Food</th>
                                                <th className="pb-1">Qty</th>
                                                <th className="pb-1">Calories</th>
                                                <th className="pb-1">Protein</th>
                                                <th className="pb-1">Carbs</th>
                                                <th className="pb-1">Fat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {meal.food_items.map((item, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td>{item.food_id.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.calories}</td>
                                                    <td>{item.protein_g}g</td>
                                                    <td>{item.carbs_g}g</td>
                                                    <td>{item.fat_g}g</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MealTrackerHistoryPage;