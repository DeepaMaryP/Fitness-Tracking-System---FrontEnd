import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { fetchFoodTrackerByDates } from "../../api/user/foodtracker";
import { useSelector } from "react-redux";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MealTrackerHistoryPage = () => {
    const [foodHistory, setFoodHistory] = useState([])
    const [graphfoodHistory, setGraphFoodHistory] = useState([])
    const [expandedDay, setExpandedDay] = useState(null);
    const [cardRange, setCardRange] = useState(3); // 3,7,custom
    const [customStart, setCustomStart] = useState(null);
    const [customEnd, setCustomEnd] = useState(null);
    const auth = useSelector((state) => state.auth);
    const [graphPeriod, setGraphPeriod] = useState(7); // 7,30,90,180

    useEffect(() => {
        filterCardFoodTracks(3); // 3 days before by default - cards
        filterGraphFoodTracks(7); // 7 days before by default - graph
    }, [auth.userId])

    // Toggle card expand/collapse
    const toggleExpand = (date) => {
        setExpandedDay(expandedDay === date ? null : date);
    };

    const getFormattedDate = (cdate) => {
        const yyyy = cdate.getFullYear();
        const mm = String(cdate.getMonth() + 1).padStart(2, "0");
        const dd = String(cdate.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`
    }

    const getFormattedDateToDisplay = (cdate) => {
        const cdateObj = new Date(cdate);
        return cdateObj.toISOString().split("T")[0];
    }

    const fetchFoodTrackerLogs = async (userId, startDate, endDate, type = "card") => {
        try {
            const formattedStart = getFormattedDate(startDate)
            const formattedEnd = getFormattedDate(endDate)

            const result = await fetchFoodTrackerByDates(userId, formattedStart, formattedEnd, auth.token);
            if (result.success && result.data) {
                switch (type) {
                    case "card":
                        setFoodHistory(result.data);
                        break;
                    case "graph":
                        setGraphFoodHistory(result.data)
                }
            }
        } catch (err) {
            console.warn("No Food tracker found");
            setFoodHistory([])
            setGraphFoodHistory([])
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

    // Filter graph based on selection
    const filterGraphFoodTracks = (range) => {
        setGraphPeriod(range)
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - range);
        fetchFoodTrackerLogs(auth.userId, startDate, endDate, 'graph');
    };

    // Prepare graph data
    const prepareGraphData = () => {
        let data = [...graphfoodHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

        if (graphPeriod <= 30) {
            // Keep daily
            return {
                labels: data.map(d => getFormattedDateToDisplay(d.date)),
                datasets: [
                    {
                        label: "Calories Consumed",
                        data: data.map(d => d.total_calories),
                        borderColor: "#3b82f6",
                        backgroundColor: "#93c5fd",
                        tension: 0.4,
                    },
                ],
            };
        } else if (graphPeriod <= 90) {
            // Weekly average
            const grouped = [];
            for (let i = 0; i < data.length; i += 7) {
                const chunk = data.slice(i, i + 7);
                const avgCalories = chunk.reduce((s, d) => s + d.total_calories, 0) / chunk.length;
                grouped.push({
                    label: `Week ${Math.ceil((i + 1) / 7)}`,
                    value: Math.round(avgCalories),
                });
            }
            return {
                labels: grouped.map(g => g.label),
                datasets: [
                    {
                        label: "Avg Calories / Week",
                        data: grouped.map(g => g.value),
                        borderColor: "#f59e0b",
                        backgroundColor: "#fde68a",
                        tension: 0.3,
                    },
                ],
            };
        } else {
            // Monthly average
            const months = {};
            data.forEach(d => {
                const month = new Date(d.date).toLocaleString('default', { month: 'short', year: 'numeric' });
                if (!months[month]) months[month] = [];
                months[month].push(d.total_calories);
            });

            const grouped = Object.entries(months).map(([month, vals]) => ({
                label: month,
                value: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
            }));

            return {
                labels: grouped.map(g => g.label),
                datasets: [
                    {
                        label: "Avg Calories / Month",
                        data: grouped.map(g => g.value),
                        borderColor: "#10b981",
                        backgroundColor: "#6ee7b7",
                        tension: 0.3,
                    },
                ],
            };
        }
    };


    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: `Calories Consumed (Last ${graphPeriod} Days)` },
        },
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Previous Food Tracker</h1>

            {/* Graph Section */}
            <div className="mb-8">
                <div className="flex gap-2 mb-2">
                    {[7, 30, 90, 180].map((d) => (
                        <button
                            key={d}
                            onClick={() => filterGraphFoodTracks(d)}
                            className={`px-3 py-1 rounded ${graphPeriod === d ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {d <= 30 ? `Last ${d} Days` : d === 90 ? "Last 3 Months" : "Last 6 Months"}
                        </button>
                    ))}
                </div>
                <Line data={prepareGraphData()} options={chartOptions} />
            </div>

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