import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/trainer"

export const getAllTrainers = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(BASE_API_URL,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data.allTrainersProfile
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch Trainer";
    }
}

export const getApprovedTrainers = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/approved`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data.allTrainersProfile
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch Trainer";
    }
}

export const fetchTrainerWithUserId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch Trainer";
    }
}

export const getApprovedTrainerCount = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/dash/approved`,
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
        return error.response?.data?.message || "Failed to fetch Trainer count";
    }
}

export const approveTrainerDetails = async (id, user, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/verify/${id}`,user, {
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
        return error.response?.data || "Failed to approve trainer";
    }
}

export const updateTrainerProfile  = async (trainerProile, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${trainerProile._id}`, trainerProile, {
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
        return error.response?.data?.message || "Failed to update trainerProile";
    }
}