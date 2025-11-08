import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'
import { fetchUserProfileWithUserId } from '../../api/user/userProfile';
import UserProfilePage from './UserProfilePage';
import UserSideMenuBar from '../../components/user/UserSideMenuBar';
import UserHeader from '../../components/user/UserHeader';


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
            const result = await fetchUserProfileWithUserId(auth.userId, auth.token)
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
            <UserHeader />
            {error && <p className="text-red-500 text-md text-center">{error}</p>}

            <div className="flex flex-col sm:flex-row">
                {/* Sidebar */}
                <div className="sm:w-48 sm:shrink-0">
                    <UserSideMenuBar />
                </div>

                {/* Main Content */}
                <main className="flex-1 sm:ml-0 mt-4 sm:mt-0 p-4 sm:p-6 bg-gray-50 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>

    )
}
export default UserLayOutPage

