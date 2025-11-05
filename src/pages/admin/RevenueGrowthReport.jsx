import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { fetchRevenueStat } from "../../api/admin/reports";
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const RevenueGrowthReport = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState([]);
  const auth = useSelector((state) => state.auth)

  const fetchReport = async (selectedYear) => {
    try {
      const res = await fetchRevenueStat(selectedYear, auth.token);     
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport(year);
  }, [year]);

  const chartData = {
    labels: reportData?.map((d) => d.monthYear),
    datasets: [
      {
        label: "Total Revenue (₹)",
        data: reportData?.map((d) => d.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Growth (%)",
        data: reportData?.map((d) => d.growth),
        type: "line",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Revenue (₹)" },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Growth (%)" },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Revenue Growth Report - ${year}` },
    },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Revenue Growth Report</h2>
        <select
          className="border px-3 py-1 rounded"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default RevenueGrowthReport;
