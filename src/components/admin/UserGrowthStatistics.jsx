import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSelector } from 'react-redux';
import { getUserStats } from '../../api/admin/reports';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false, // ✅ allows responsive resizing
  plugins: {
    title: {
      display: true,
      text: 'Registrations in past 6 months',
    },
    legend: {
      display: true,
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

function UserGrowthStatistics() {
  const auth = useSelector((state) => state.auth);
  const [userStat, setUserStat] = useState([]);

  const getUserStatistics = async () => {
    try {
      const data = await getUserStats(auth.token);
      if (data.success) {
        setUserStat(data.monthsList);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.error('Failed to get user metrics:', err);
    }
  };

  useEffect(() => {
    getUserStatistics();
  }, []);

  const months = userStat?.map((stat) => stat.label);
  const regCount = userStat?.map((stat) => stat.registrations);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Number of Users',
        data: regCount,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] bg-white p-4 rounded-xl shadow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default UserGrowthStatistics;
