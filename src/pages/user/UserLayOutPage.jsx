import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'

import LogInHeader from '../../components/LogInHeader'
import { fetchUserProfileWithId } from '../../api/user/userProfile';
import UserProfilePage from './UserProfilePage';
import UserSideMenuBar from '../../components/user/UserSideMenuBar';


function UserLayOutPage() {
    const auth = useSelector((state) => state.auth)
    const [error, setError] = useState("");
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        try {
            if (!auth || !auth.token) return;
            fetchProfile();
        } catch (error) {
            console.log(error);
        }
    }, [auth.token])

    const fetchProfile = async () => {
        try {
            const result = await fetchUserProfileWithId(auth.userId, auth.token)
            if (result.success && result.data) setHasProfile(true); else setHasProfile(false)
        } catch (err) {
            setHasProfile(false);
            console.error("Error fetching UserProfile:", err)
            setError(`Error fetching UserProfile:${err}`)
        }
    };

    const handleProfileSaved = () => {
        setHasProfile(true);
        setError("")
    };

    return (
        <div>
            <LogInHeader />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {!hasProfile ? (
                <UserProfilePage onProfileSaved={handleProfileSaved} />
            ) : (
                <div className='grid grid-cols-6 rounded-lg'>
                    <div className='col-span-1'>
                        <UserSideMenuBar />
                    </div>
                    <div className='col-span-5 '>
                        <Outlet />
                    </div>
                </div>

            )}
        </div>
    )
}
export default UserLayOutPage

