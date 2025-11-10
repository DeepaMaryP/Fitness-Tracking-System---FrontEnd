import axios from "axios";

const BASE_API_URL = "https://fitness-tracking-system-back-end.vercel.app/api/workouttracker"

export const fetchUserWorkOutTracker = async (userId, date, token) => {
    try {
        if (!token) return
        const newUrl = `${BASE_API_URL}/tracker?userId=${userId}&date=${date}`

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

export const createWorkOutTracker = async (workOutDet, token) => {
    try {
        if (!token) return
        const { _id, ...tracker } = workOutDet;
        const response = await axios.post(BASE_API_URL, tracker, {
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