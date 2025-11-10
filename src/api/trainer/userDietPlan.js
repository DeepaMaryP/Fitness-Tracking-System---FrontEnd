import axios from "axios";

const BASE_API_URL = "https://fitness-tracking-system-back-end.vercel.app/api/userdietplan"

export const fetchUserDietPlan = async (userId, token) => {
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
        return error.response?.data?.message || "Failed to fetch UserDietPlan";
    }
}

export const updateUserDietPlan  = async (userdiet, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${userdiet._id}`, userdiet, {
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
        return error.response?.data?.message || "Failed to update UserDietPlan";
    }
}

export const createUserDietPlan = async (userdiet, token) => {
    try {
        if (!token) return       
        
        const { _id, ...userDietPlan } = userdiet;
        const response = await axios.post(BASE_API_URL, userDietPlan, {
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
        return (error.response?.data?.message || 'Failed to Create UserDietPlan')
    }
}

export const deleteUserDietPlan = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete UserDietPlan";
    }
}