import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate, getFormattedDateToDisplay } from '../utils';
import { useSelector } from 'react-redux';
import { fetchWorkOutTrackerByDates } from '../../api/user/workoutTracker.';

function WorkOutTrackerCard({ userId }) {
    const [workOutHistory, setWorkOutHistory] = useState([])
    const [expandedDay, setExpandedDay] = useState(null);
    const [cardRange, setCardRange] = useState(3); // 3,7,custom
    const [customStart, setCustomStart] = useState(null);
    const [customEnd, setCustomEnd] = useState(null);
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        filterCardWorkOutTracks(3); // 3 days before by default - cards       
    }, [userId])


    // Toggle card expand/collapse
    const toggleExpand = (date) => {
        setExpandedDay(expandedDay === date ? null : date);
    };

    const fetchWorkOutTrackerLogs = async (userId, startDate, endDate) => {
        try {
            const formattedStart = getFormattedDate(startDate)
            const formattedEnd = getFormattedDate(endDate)

            const result = await fetchWorkOutTrackerByDates(userId, formattedStart, formattedEnd, auth.token);
            if (result.success && result.data) {


                setWorkOutHistory(result.data);
            }
        } catch (err) {
            console.warn("No WorkOut tracker found");
            setWorkOutHistory([])
        }
    };

    // Filter cards based on selection
    const filterCardWorkOutTracks = (range, findDb = false) => {
        setCardRange(range)
        if (range === "custom") {
            if (customStart && customEnd) {
                customStart.setHours(0, 0, 0, 0);   // start of day    
                customEnd.setHours(23, 59, 59, 999); // end of day       
                const diffDays = (customEnd - customStart) / (1000 * 60 * 60 * 24);
                if (diffDays > 7) { alert("Date range should not exceed 7 days"); setCustomStart(""); return; }

                if (findDb) { fetchWorkOutTrackerLogs(userId, customStart, customEnd) }
            }
        } else {
            const endDate = new Date();
            const startDate = new Date(endDate);

            startDate.setDate(endDate.getDate() - range);
            fetchWorkOutTrackerLogs(userId, startDate, endDate);
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-4 sm:p-6 min-h-[400px] flex flex-col">
            {/* Range Selector */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
                <label className="font-medium text-sm sm:text-base">Show Logs:</label>
                {[3, 7, "custom"].map((range) => (
                    <button
                        key={range}
                        onClick={() => filterCardWorkOutTracks(range)}
                        className={`px-3 py-1 rounded text-sm sm:text-base transition ${cardRange === range
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {range === "custom"
                            ? `Custom Range (Max 7 Days)`
                            : `Last ${range} Days`}
                    </button>
                ))}
            </div>

            {/* Custom Date Range */}
            {cardRange === "custom" && (
                <div className="mb-6 flex flex-wrap gap-4 sm:gap-6 items-end p-4 rounded-lg border">
                    <div  className="flex flex-col">
                        <label className="block mb-1 text-sm">Start Date:</label>
                        <DatePicker
                            selected={customStart}
                            onChange={(date) => setCustomStart(date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select start date"
                            className="border p-2 rounded text-sm w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">End Date:</label>
                        <DatePicker
                            selected={customEnd}
                            onChange={(date) => setCustomEnd(date)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select end date"
                            className="border p-2 rounded text-sm w-full"
                        />
                    </div>
                    <div className="self-end">
                        <button
                            className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
                            onClick={() => filterCardWorkOutTracks("custom", true)}
                        >
                            Find
                        </button>
                    </div>
                </div>
            )}

            {/* Workout Logs */}
            <div className="space-y-4">
                {workOutHistory?.map((day) => (
                    <div
                        key={day.date}
                        className="border rounded-lg shadow-sm bg-gray-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                            onClick={() => toggleExpand(day.date)}
                        >
                            <div>
                                <p className="font-semibold text-sm sm:text-base">
                                    {getFormattedDateToDisplay(day.date)}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Calories: {day.total_calories_burned} kcal
                                </p>
                            </div>
                            <div className="text-gray-600 text-lg">
                                {expandedDay === day.date ? "▲" : "▼"}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedDay === day.date && (
                            <div className="p-4">
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="min-w-full table-fixed text-left border-collapse text-xs sm:text-sm">
                                        <thead>
                                            <tr className="border-b bg-blue-50 text-gray-700">
                                                <th className="w-48 pb-2 pr-3">Exercise</th>
                                                <th className="w-16 pb-2 pr-3">Sets</th>
                                                <th className="w-16 pb-2 pr-3">Reps</th>
                                                <th className="w-24 pb-2 pr-3">Duration</th>
                                                <th className="w-16 pb-2 pr-3">MET</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {day.exercises.map((item, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-b last:border-0 hover:bg-gray-50"
                                                >
                                                    <td
                                                        className="py-1 pr-3 w-48 truncate"
                                                        title={item.name}
                                                    >
                                                        {item.name}
                                                    </td>
                                                    <td className="py-1 pr-3">{item.sets}</td>
                                                    <td className="py-1 pr-3">{item.reps}</td>
                                                    <td className="py-1 pr-3">{item.duration_min} min</td>
                                                    <td className="py-1 pr-3">{item.met}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WorkOutTrackerCard
