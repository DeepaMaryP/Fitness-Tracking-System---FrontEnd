import React from 'react'
import { useSelector } from 'react-redux';
import BurntCalorieGraph from '../../components/user/BurntCalorieGraph';
import WorkOutTrackerCard from '../../components/user/WorkOutTrackerCard';

function WorkOutTracketHistoryPage() {
  const auth = useSelector((state) => state.auth);
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Previous WorkOut Tracker</h1>

            {/* Graph Section */}
            <BurntCalorieGraph userId={auth.userId} />

            {/* Card Section */}
            <WorkOutTrackerCard userId={auth.userId} />

        </div>
    );
}

export default WorkOutTracketHistoryPage
