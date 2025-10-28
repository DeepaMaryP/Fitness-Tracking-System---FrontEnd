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
        <div>
            {/* Cards Range Selector */}
            <div className="mb-4 flex gap-2 items-center">
                <label className="font-medium">Show Logs:</label>
                {[3, 7, "custom"].map((range) => (
                    <button
                        key={range}
                        onClick={() => { filterCardWorkOutTracks(range) }}

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
                        <button className="bg-blue-600 px-4 py-1 rounded-lg" onClick={() => { filterCardWorkOutTracks('custom', true) }}>Find</button>
                    </div>
                </div>
            )}

            {workOutHistory?.map((day) => (
                <div key={day.date} className="border rounded-lg mb-4 shadow-sm">
                    <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
                        onClick={() => toggleExpand(day.date)}
                    >
                        <div>
                            <p className="font-semibold">{getFormattedDateToDisplay(day.date)}</p>
                            <p className="text-sm text-gray-600">
                                Calories: {day.total_calories_burned} kcal
                            </p>
                        </div>
                        <div>{expandedDay === day.date ? "▲" : "▼"}</div>
                    </div>

                    {expandedDay === day.date && (
                        <div className="p-4">
                            <div className="mb-4">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-1">Exercise</th>
                                            <th className="pb-1">Sets</th>
                                            <th className="pb-1">Reps</th>
                                            <th className="pb-1">Duration</th>
                                            <th className="pb-1">Met</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.exercises.map((item, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td>{item.name}</td>
                                                <td>{item.sets}</td>
                                                <td>{item.reps}</td>
                                                <td>{item.duration_min}</td>
                                                <td>{item.met}</td>
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
    )
}

export default WorkOutTrackerCard
