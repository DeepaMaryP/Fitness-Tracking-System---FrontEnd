import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import MetricsCard from '../../components/admin/MetricsCard'
import UserGrowthStatistics from '../../components/admin/UserGrowthStatistics'
import TrainerUsersBarChart from '../../components/admin/TrainerUsersBarChart'
import { signIn } from '../../api/auth'

function TrainerDashBoardPage() {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState(
    {
      email: 'testtrainer1@gmail.com',
      password: '12345678'
    }
  );

  useEffect(() => {
    try {
    //  dispatch(signIn(credentials))

    } catch (error) {
      console.log(error);      
    }
  }, [])

  return (
    <div >      

     
    </div>
  )
}


export default TrainerDashBoardPage
