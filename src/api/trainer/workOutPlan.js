import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/workoutplan"

export const fetchAllWorkOutPlan = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(BASE_API_URL, {
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
        return error.response?.data?.message || "Failed to fetch WorkOutPlans";
    }
}

export const fetchWorkOutPlanWithId = async (id, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/${id}`,
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
        return error.response?.data?.message || "Failed to fetch WorkOutPlan";
    }
}

export const fetchWorkOutPlanWithUserId = async (userId, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/user/${userId}`,
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
        throw new Error(error.response?.data?.message || "Failed to fetch BodyMeasurement");
    }
}

export const updateWorkOutPlan  = async (workout, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${workout._id}`, workout, {
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
        return error.response?.data?.message || "Failed to update WorkOutPlan";
    }
}

export const createWorkOutPlan  = async (workoutDet, token) => {
    try {
        if (!token) return
        const { _id, ...workout } = workoutDet;    
        
        const response = await axios.post(BASE_API_URL, workout, {
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
        return (error.response?.data?.message || 'Failed to Create WorkOutPlan')
    }
}

export const deleteWorkOutPlan = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete WorkOutPlan";
    }
}
