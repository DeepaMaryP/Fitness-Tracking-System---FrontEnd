import React from 'react'
import { useSelector } from 'react-redux';
import MealTrackerCard from '../../components/user/MealTrackerCard'
import { useParams } from 'react-router-dom';

function UserMealTrackerForTrainer() { 
  const userId = useParams().id
  return (
    <div>
       {/* Card Section */}
            <MealTrackerCard  userId={userId}/>
    </div>
  )
}

export default UserMealTrackerForTrainer
