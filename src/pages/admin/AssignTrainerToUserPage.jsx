import React from 'react'
import AssignTrainers from '../../components/admin/AssignTrainers'
import { fetchAllActiveUnAsssignedPaidUsers } from '../../api/admin/user'
import { getApprovedTrainers } from '../../api/admin/trainerProfile'
import { createUserTrainer, fetchUserTrainerWithUserId } from '../../api/admin/usertrainer'
import { useParams } from 'react-router-dom'

function AssignTrainerToUserPage() {
 const userId = useParams().userid
  return (
    <div>
      <AssignTrainers fetchUnassignedUsers={fetchAllActiveUnAsssignedPaidUsers} fetchTrainers={getApprovedTrainers}
        saveUserTrainer={createUserTrainer} fetchAssignments = {fetchUserTrainerWithUserId} userId = {userId}/>
    </div>
  )
}

export default AssignTrainerToUserPage;

