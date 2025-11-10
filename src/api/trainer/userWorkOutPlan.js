import axios from "axios";

const BASE_API_URL = "https://fitness-tracking-system-back-end.vercel.app/api/userworkoutplan"

export const fetchUserWorkOutPlan = async (userId, token) => {
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
        return error.response?.data?.message || "Failed to fetch UserWorkOutPlan";
    }
}

export const updateUserWorkOutPlan  = async (userWorkOut, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${userWorkOut._id}`, userWorkOut, {
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
        return error.response?.data?.message || "Failed to update UserWorkOutPlan";
    }
}

export const createUserWorkOutPlan = async (userWorkOut, token) => {
    try {
        if (!token) return       
        
        const { _id, ...userWorkOutPlan } = userWorkOut;
        const response = await axios.post(BASE_API_URL, userWorkOutPlan, {
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
        return (error.response?.data?.message || 'Failed to Create UserWorkOutPlan')
    }
}

export const deleteUserWorkOutPlan = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete UserWorkOutPlan";
    }
}