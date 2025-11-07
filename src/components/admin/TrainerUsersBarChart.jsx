import React, { useEffect, useState } from 'react'
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
import { useSelector } from 'react-redux';
import { getTrainerStats } from '../../api/admin/reports';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TrainerUsersBarChart() {

  const auth = useSelector((state) => state.auth)
  const [trainerStat, setTrainerStat] = useState();

  const getTrainerStatistics = async () => {
    try {
      const data = await getTrainerStats(auth.token);     
      if (data.success) {
        setTrainerStat(data.trainerStats)
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error("Failed to get trainer assignment stats:", err);
    }
  };

  useEffect(() => {
    getTrainerStatistics()
  }, [])

  const trainers = trainerStat?.map(stat => stat.trainerName);
  const userCount = trainerStat?.map(stat => stat.totalUsers);

  const trainerData = {
    labels: trainers,
    datasets: [
      {
        label: "Users Assigned",
        data: userCount,
        backgroundColor: "#60a5fa", // Tailwind blue-400
        borderRadius: 8, // Rounded corners
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Users Assigned per Trainer",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4">
        <Bar data={trainerData} options={options} />
      </div>
    </div>
  )
}

export default TrainerUsersBarChart

