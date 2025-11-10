import axios from "axios";

const BASE_API_URL = "https://fitness-tracking-system-back-end.vercel.app/api/profile"

export const fetchUserProfileWithUserId = async (userId, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )      
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        throw new Error(error.response?.data?.message || "Failed to fetch UserProfile");
    }
}

export const updateUserProfile  = async (profile, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${profile._id}`, profile, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to update UserProfile";
    }
}

export const createUserProfile  = async (profile, token) => {
    try {
        if (!token) return              
        const response = await axios.post(BASE_API_URL, profile, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch (error) {
        console.log({ error });
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        return (error.response?.data?.message || 'Failed to Create UserProfile')
    }
}

export const deleteUserProfile = async (id, token) => {
    try {
        if (!token) return
        const response = await axios.delete(`${BASE_API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to delete UserProfile";
    }
}
