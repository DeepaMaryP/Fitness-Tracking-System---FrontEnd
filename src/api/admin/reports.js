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

export const getMonthlyRevenue = async (date, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/revenuecurrentmonth/${date}`,
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

export const getMetrics = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(`${BASE_API_URL}/dash/metrics`, {
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
        return error.response?.data?.message || "Failed to fetch User stats";
    }
}

export const getUserStats = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(`${BASE_API_URL}/dash/userstat`, {
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
        return error.response?.data?.message || "Failed to fetch User stats";
    }
}

export const getTrainerStats = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(`${BASE_API_URL}/dash/trainerstat`, {
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
        return error.response?.data?.message || "Failed to fetch Trainer stats";
    }
}

export const getPendingTrainerAssignments = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(`${BASE_API_URL}/dash/pendingassignments`, {
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
        return error.response?.data?.message || "Failed to fetch pending Trainer Assignments";
    }
}

export const getApprovalPendingTrainerCount = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(`${BASE_API_URL}/dash/approvalpending`, {
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
        return error.response?.data?.message || "Failed to fetch pending Trainer Assignments";
    }
}