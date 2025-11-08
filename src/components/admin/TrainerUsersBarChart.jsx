import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { getTrainerStats } from "../../api/admin/reports";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TrainerUsersBarChart() {
  const auth = useSelector((state) => state.auth);
  const [trainerStat, setTrainerStat] = useState([]);

  const getTrainerStatistics = async () => {
    try {
      const data = await getTrainerStats(auth.token);
      if (data.success) {
        setTrainerStat(data.trainerStats);
      }
    } catch (err) {
      console.error("Failed to get trainer assignment stats:", err);
    }
  };

  useEffect(() => {
    getTrainerStatistics();
  }, []);

  const trainers = trainerStat?.map((stat) => stat.trainerName);
  const userCount = trainerStat?.map((stat) => stat.totalUsers);

  const trainerData = {
    labels: trainers,
    datasets: [
      {
        label: "Users Assigned",
        data: userCount,
        backgroundColor: "#60a5fa",
        borderRadius: 6,
        categoryPercentage: 0.4, // ✅ controls bar width relative to category width
        barPercentage: 0.6,      // ✅ narrows bars further
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 12 } },
      },
      title: {
        display: true,
        text: "Users Assigned per Trainer",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { color: "#f0f0f0" },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative w-full h-[300px] sm:h-[400px] bg-white shadow-md rounded-xl p-4">
        <Bar data={trainerData} options={options} />
      </div>
    </div>
  );
}

export default TrainerUsersBarChart;
