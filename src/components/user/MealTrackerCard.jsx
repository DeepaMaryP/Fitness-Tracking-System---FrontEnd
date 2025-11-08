import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchFoodTrackerByDates } from '../../api/user/foodtracker';
import { getFormattedDate, getFormattedDateToDisplay } from '../utils';
import { useSelector } from 'react-redux';

function MealTrackerCard({ userId }) {
    const [foodHistory, setFoodHistory] = useState([])
    const [expandedDay, setExpandedDay] = useState(null);
    const [cardRange, setCardRange] = useState(3); // 3,7,custom
    const [customStart, setCustomStart] = useState(null);
    const [customEnd, setCustomEnd] = useState(null);
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        filterCardFoodTracks(3); // 3 days before by default - cards       
    }, [userId])


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
    const filterCardFoodTracks = (range, findDb = false) => {
        setCardRange(range)
        if (range === "custom") {
            if (customStart && customEnd) {
                customStart.setHours(0, 0, 0, 0);   // start of day    
                customEnd.setHours(23, 59, 59, 999); // end of day       
                const diffDays = (customEnd - customStart) / (1000 * 60 * 60 * 24);
                if (diffDays > 7) { alert("Date range should not exceed 7 days"); setCustomStart(""); return; }

                if (findDb) { fetchFoodTrackerLogs(userId, customStart, customEnd) }
            }
        } else {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - range);
            fetchFoodTrackerLogs(userId, startDate, endDate);
        }
    };

    return (
        <div className="p-3 sm:p-6 bg-white rounded-xl shadow-md min-h-[400px]">
            {/* Range Selector */}
            <div className="mb-4 flex flex-wrap gap-2 items-center justify-center sm:justify-start">
                <label className="font-semibold text-gray-700 whitespace-nowrap">
                    Show Logs:
                </label>
                {[3, 7, "custom"].map((range) => (
                    <button
                        key={range}
                        onClick={() => filterCardFoodTracks(range)}
                        className={`px-3 py-1 rounded-lg text-sm sm:text-base transition-all duration-200 ${cardRange === range
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                    >
                        {range === "custom"
                            ? "Custom Range (Max 7 Days)"
                            : `Last ${range} Days`}
                    </button>
                ))}
            </div>

            {/* Custom Date Range */}
            {cardRange === "custom" && (
                <div className="mb-6 flex flex-wrap gap-4 sm:gap-6 items-end p-4 rounded-lg border">
                    <div className="flex flex-col">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Start Date:
                        </label>
                        <DatePicker
                            selected={customStart}
                            onChange={(date) => setCustomStart(date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select start date"
                            className="border p-2 rounded-lg w-40 sm:w-48 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            End Date:
                        </label>
                        <DatePicker
                            selected={customEnd}
                            onChange={(date) => setCustomEnd(date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select end date"
                            className="border p-2 rounded-lg w-40 sm:w-48 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={() => filterCardFoodTracks("custom", true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Find
                    </button>
                </div>
            )}

            {/* Food History Cards */}
            {foodHistory?.map((day) => (
                <div  key={day.date} className="border border-gray-200 rounded-xl mb-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden" >
                    {/* Header */}
                    <div
                        className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 cursor-pointer hover:bg-blue-50 transition"
                        onClick={() => toggleExpand(day.date)}  >
                        <div>
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                {getFormattedDateToDisplay(day.date)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Calories: {day.total_calories} kcal | Protein:{" "}
                                {day.total_protein_g}g | Carbs: {day.total_carbs_g}g | Fat:{" "}
                                {day.total_fat_g}g
                            </p>
                        </div>
                        <div className="text-lg sm:text-xl text-blue-500">
                            {expandedDay === day.date ? "▲" : "▼"}
                        </div>
                    </div>

                    {/* Expanded View */}
                    {expandedDay === day.date && (
                        <div className="p-3 sm:p-5 bg-white">
                            {day.meals.map((meal) => (
                                <div key={meal.meal_type.type} className="mb-6">
                                    <h3 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base border-b border-gray-200 pb-1">
                                        {meal.meal_type.type}
                                    </h3>

                                    {/* Scrollable Table */}
                                    <div className="max-h-64 overflow-x-auto">
                                        <table className="min-w-full table-fixed text-left border-collapse text-xs sm:text-sm">
                                            <thead>
                                                <tr className="border-b bg-blue-50 text-gray-700">
                                                    <th className="pb-2 pr-3">Food</th>
                                                    <th className="pb-2 pr-3">Qty</th>
                                                    <th className="pb-2 pr-3">Calories</th>
                                                    <th className="pb-2 pr-3">Protein</th>
                                                    <th className="pb-2 pr-3">Carbs</th>
                                                    <th className="pb-2 pr-3">Fat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {meal.food_items.map((item, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="border-b last:border-0 hover:bg-gray-50"
                                                    >
                                                        <td className="py-1 pr-3 w-40 truncate">{item.food_id.name}</td>
                                                        <td className="py-1 pr-3">{item.quantity}</td>
                                                        <td className="py-1 pr-3">{item.calories}</td>
                                                        <td className="py-1 pr-3">{item.protein_g}g</td>
                                                        <td className="py-1 pr-3">{item.carbs_g}g</td>
                                                        <td className="py-1 pr-3">{item.fat_g}g</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MealTrackerCard
