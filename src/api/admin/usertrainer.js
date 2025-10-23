import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/usertrainer"

export const fetchAllUserTrainers = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(BASE_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })       
        return response.data.allUserTrainers
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch User Trainers";
    }
}

export const fetchUserTrainerWithUserId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch UserTrainer";
    }
}

export const fetchUsersAssignedToTrainer = async (trainerId, token) => {
    try {
        if (!token) return
        const response = await axios.get(`${BASE_API_URL}/trainer/${trainerId}`,
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
        return error.response?.data?.message || "Failed to fetch UserTrainer";
    }
}

export const updateUserTrainer  = async (usertrainer, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${usertrainer._id}`, usertrainer, {
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
        return error.response?.data?.message || "Failed to update UserTrainer";
    }
}

export const createUserTrainer  = async (userTrainer, token) => {
    try {
        if (!token) return         
        const response = await axios.post(BASE_API_URL, userTrainer, {
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
        return (error.response?.data?.message || 'Failed to Create UserTrainer')
    }
}

export const deleteUserTrainerByUser = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete UserTrainer";
    }
}
