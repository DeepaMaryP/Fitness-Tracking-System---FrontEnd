import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getFormattedDate, getFormattedDateToDisplay } from '../utils';
import { fetchFoodTrackerByDates } from '../../api/user/foodtracker';
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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CalorieConsumptionGraph({userId}) {
    const auth = useSelector((state) => state.auth);
    const [graphPeriod, setGraphPeriod] = useState(7); // 7,30,90,180
    const [graphfoodHistory, setGraphFoodHistory] = useState([])

    useEffect(() => {
        filterGraphFoodTracks(7); // 7 days before by default - graph
    }, [])

    // Filter graph based on selection
    const filterGraphFoodTracks = (range) => {
        setGraphPeriod(range)
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - range);
        fetchFoodTrackerLogs(userId, startDate, endDate, 'graph');
    };

    const fetchFoodTrackerLogs = async (userId, startDate, endDate, type = "card") => {
        try {
            const formattedStart = getFormattedDate(startDate)
            const formattedEnd = getFormattedDate(endDate)

            const result = await fetchFoodTrackerByDates(userId, formattedStart, formattedEnd, auth.token);
            if (result.success && result.data) {
                setGraphFoodHistory(result.data)
            }
        } catch (err) {
            console.warn("No Food tracker found");
            setGraphFoodHistory([])
        }
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
    )
}

export default CalorieConsumptionGraph
