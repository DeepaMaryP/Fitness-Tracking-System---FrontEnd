import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/reports"

export const fetchUserGrowthPercentage = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/goalstat`,
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

export const fetchRevenueStat = async (year, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/revenue/${year}`,
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
        throw new Error(error.response?.data?.message || "Failed to fetch revenue stat");
    }
}
