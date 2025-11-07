import React, { useEffect, useState } from 'react'
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
    plugins: {
        title: {
            display: true,
            text: 'Registrations in past 6 months',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

function UserGrowthStatistics() {
    const auth = useSelector((state) => state.auth)
    const [userStat, setUserStat] = useState();

    const getUserStatistics = async () => {
        try {
            const data = await getUserStats(auth.token);
            if (data.success) {
                setUserStat(data.monthsList)
            } else {
                console.log(data);
            }
        } catch (err) {
            console.error("Failed to get user metrics:", err);
        }
    };

    useEffect(() => {
        getUserStatistics()
    }, [])

    const months = userStat?.map(stat => stat.label);
    const regCount =  userStat?.map(stat => stat.registrations);
    const data = {        
        labels: months,
        datasets: [
            {
                label: 'Number of Users',
                data: regCount,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <div style={{ width: '700px', height: '400px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

export default UserGrowthStatistics
