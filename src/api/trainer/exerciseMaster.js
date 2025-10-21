import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/exerciseMaster"

export const fetchAllExerciseMaster = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(BASE_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allExerciseMaster
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch ExerciseMaster";
    }
}

export const fetchExerciseMasterWithId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch ExerciseMaster";
    }
}

export const updateExerciseMaster  = async (Exercise, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${Exercise._id}`, Exercise, {
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
        return error.response?.data?.message || "Failed to update ExerciseMaster";
    }
}

export const createExerciseMaster = async (ExerciseDet, token) => {
    try {
        if (!token) return
        console.log(ExerciseDet);
        
        const { _id, ...Exercise } = ExerciseDet;
        const response = await axios.post(BASE_API_URL, Exercise, {
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
        return (error.response?.data?.message || 'Failed to Create ExerciseMaster')
    }
}

export const deleteExerciseMaster = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete ExerciseMaster";
    }
}