import React from 'react'
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

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const trainerData = {
  labels: ["Trainer A", "Trainer B", "Trainer C", "Trainer D", "Trainer E"],
  datasets: [
    {
      label: "Users Assigned",
      data: [12, 18, 7, 22, 15],
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

function TrainerUsersBarChart() {
    return (
        <div>            
            <div className="bg-white shadow rounded-lg p-4">
                <Bar data={trainerData} options={options} />
            </div>           
        </div>
    )
}

export default TrainerUsersBarChart

