import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/fitplans"

export const fetchAllFitnessProgram = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(BASE_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allPaymentPlan
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch Fitness Programs";
    }
}

export const fetchFitnessProgramWithId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch FitnessProgram";
    }
}

export const updateFitnessProgram  = async (fitProgram, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${fitProgram._id}`, fitProgram, {
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
        return error.response?.data || "Failed to update FitnessProgram";
    }
}

export const createFitnessProgram  = async (fitProgramDet, token) => {
    try {
        if (!token) return
        const { _id, ...fitProgram } = fitProgramDet;
        const response = await axios.post(BASE_API_URL, fitProgram, {
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
        return (error.response?.data?.message || 'Failed to Create Fitness Program')
    }
}

export const deleteFitnessProgaram = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete FitnessProgram";
    }
}
