import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUserGrowthPercentage } from "../../api/user/targetGoal";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export default function GoalAchievementReport() {
    const [reportData, setReportData] = useState()
    const auth = useSelector((state) => state.auth)

    // Define color palette
    const colors = [
        "rgba(75, 192, 192, 1)",   // teal
        "rgba(255, 99, 132, 1)",   // pink/red
        "rgba(255, 159, 64, 1)",   // orange
        "rgba(54, 162, 235, 1)",   // blue
        "rgba(153, 102, 255, 1)",  // purple
    ];

    useEffect(() => {
        loadGrowthStats()
    }, []);

    const loadGrowthStats = async () => {
        try {
            const res = await fetchUserGrowthPercentage(auth.token)
            setReportData(res.data)
        } catch (err) {
            // SetError("Unable to get User Growth Statistics")
            console.error("Error fetching User Growth Statistics:", err)
        }
    }
    // Prepare labels and data
    const labels = reportData?.map((item) => item.monthYear);
    const achievementRates = reportData?.map((item) => item.achievementRate);
    const totalGoals = reportData?.map((item) => item.totalGoals);
    const achievedGoals = reportData?.map((item) => item.achievedGoals);

    // Create dataset array
    const chartData = {
        labels,
        datasets: [
            {
                label: "Goal Achievement Rate (%)",
                data: achievementRates,
                borderColor: colors[0],
                backgroundColor: colors[0].replace("1)", "0.3)"), // translucent fill
                tension: 0.4,
                borderWidth: 2,
                fill: true,
            },
            {
                label: "Total Goals Set",
                data: totalGoals,
                borderColor: colors[2],
                backgroundColor: colors[2].replace("1)", "0.3)"),
                tension: 0.4,
                borderWidth: 2,
                fill: true,
            },
            {
                label: "Achieved Goals",
                data: achievedGoals,
                borderColor: colors[1],
                backgroundColor: colors[1].replace("1)", "0.3)"),
                tension: 0.4,
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    // Optional dynamic styling loop (for more datasets)
    chartData.datasets.forEach((d, i) => {
        d.borderColor = colors[i % colors.length];
        d.backgroundColor = colors[i % colors.length].replace("1)", "0.3)");
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Goal Achievement Trends by Month",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: "Achievement Rate / Goals" },
            },
        },
    };

    return (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl m-2 mt-10 h-[450px]">            
            <Line data={chartData} options={options} />
        </div>
    );
}
