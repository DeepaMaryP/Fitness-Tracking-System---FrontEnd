import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/targetgoal"

export const fetchTargetGoalWithUserId = async (userId, token) => {
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
        throw new Error(error.response?.data?.message || "Failed to fetch targetGoal");
    }
}

export const updateTargetGoal  = async (targetGoal, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${targetGoal.userId}`, targetGoal, {
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
        return error.response?.data?.message || "Failed to update targetGoal";
    }
}

export const createTargetGoal  = async (targetGoal, token) => {
    try {
        if (!token) return              
        const response = await axios.post(BASE_API_URL, targetGoal, {
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
        return (error.response?.data?.message || 'Failed to Create Target Goal')
    }
}

