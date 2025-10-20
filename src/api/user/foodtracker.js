import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/foodtracker"

export const fetchTodaysFoodTrackerWithUserId = async (userId, token) => {
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
        throw new Error(error.response?.data?.message || "Failed to fetch FoodTracker");
    }
}

export const fetchFoodTrackerByDates = async (userId, startDate, endDate, token) => {
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
        throw new Error(error.response?.data?.message || "Failed to fetch FoodTracker");
    }
}

export const createFoodTracker  = async (FoodTracker, token) => {
    try {
        if (!token) return              
        const response = await axios.post(BASE_API_URL, FoodTracker, {
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
        return (error.response?.data?.message || 'Failed to Create Food Tracker')
    }
}

