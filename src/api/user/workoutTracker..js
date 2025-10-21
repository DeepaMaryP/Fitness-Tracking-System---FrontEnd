import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/workouttracker"

export const fetchWorkOutTrackerWithUserId = async (userId, token) => {
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
        throw new Error(error.response?.data?.message || "Failed to fetch WorkOutTracker");
    }
}

export const fetchWorkOutTrackerForGraphWithUserId = async (userId, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/loggraph/${userId}`,
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
        throw new Error(error.response?.data?.message || "Failed to fetch WorkOutTracker");
    }
}

export const fetchWorkOutTrackerByDates = async (userId, startDate, endDate, token) => {
    try {
        if (!token) return
        const newUrl = `${BASE_API_URL}/logs?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
        const response = await axios.get(newUrl,
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
        throw new Error(error.response?.data?.message || "Failed to fetch WorkOutTracker");
    }
}

export const createWorkOutTracker = async (WorkOut, token) => {
    try {
        if (!token) return
        const response = await axios.post(BASE_API_URL, WorkOut, {
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
        return (error.response?.data?.message || 'Failed to Create WorkOutTracker')
    }
}