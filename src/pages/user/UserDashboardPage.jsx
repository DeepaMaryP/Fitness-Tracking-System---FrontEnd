import React from 'react'
import UserMealTrackerPage from './UserMealTrackerPage';

function UserDashboardPage() {       
    return (
        <div>
            <UserMealTrackerPage />
           {/*  {!hasProfile ? (
                <UserProfilePage onProfileSaved={handleProfileSaved} />
            ) : (
                <div className='grid grid-cols-6 rounded-lg'>
                    <div className='col-span-1'>
                        <UserSideMenuBar />
                    </div>
                    <div className='col-span-5 '>
                        <UserMealTrackerPage />
                    </div>
                </div>

            )} */}
        </div>

    )
}

export default UserDashboardPage
