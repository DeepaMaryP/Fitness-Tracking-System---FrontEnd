import React from 'react'
import MealTrackerCard from '../../components/user/MealTrackerCard'
import { useParams } from 'react-router-dom';
import WorkOutTrackerCard from '../../components/user/WorkOutTrackerCard';

function UserMealTrackerForTrainer() {
  const userId = useParams().id
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Previous Food Tracker</h1>
      <MealTrackerCard userId={userId} />

      <h1 className="text-2xl font-bold mb-6">Previous WorkOut Tracker</h1>
      <WorkOutTrackerCard userId={userId} />
    </div>
  )
}

export default UserMealTrackerForTrainer
