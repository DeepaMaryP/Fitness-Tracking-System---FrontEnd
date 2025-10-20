import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchBodyMeasurementForGraphWithUserId } from "../../api/user/bodymeasurement";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const BodyMeasurementsProgress = () => {
    const [records, setRecords] = useState([]);
    const navigate = useNavigate()
    const auth = useSelector((state) => state.auth); 

    const fetchMeasurements = async () => {
        try {
            const result = await fetchBodyMeasurementForGraphWithUserId(auth.userId, auth.token)
            if (result.success && result.data) {
                const sorted = result.data
                if (sorted.length > 0) {
                    setRecords(sorted)
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    const chartData = {
        labels: records.map((r) => new Date(r.date).toLocaleDateString()),
        datasets: [
            {
                label: "Weight (kg)",
                data: records.map((r) => r.weight_kg),
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79, 70, 229, 0.2)",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Weight Progress Over Time" },
        },
        scales: {
            y: { beginAtZero: false },
        },
    };

    const backtoEntry = () => {
        navigate("/user/bodymeasurements")
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Progress & Trends</CardTitle>
                    <Button variant="outline" onClick={backtoEntry}>
                        Back to Entry
                    </Button>
                </CardHeader>
                <CardContent>
                    {records.length > 0 ? (
                        <Line data={chartData} options={options} />
                    ) : (
                        <p className="text-center text-gray-500">No data available yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BodyMeasurementsProgress;
