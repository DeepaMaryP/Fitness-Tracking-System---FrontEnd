import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/dietPlan"

export const fetchAllDietPlan = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(BASE_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allDietPlans
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch DietPlans";
    }
}

export const fetchDietPlanWithId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch DietPlan";
    }
}

export const updateDietPlan  = async (diet, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${diet._id}`, diet, {
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
        return error.response?.data?.message || "Failed to update DietPlan";
    }
}

export const createDietPlan  = async (dietDet, token) => {
    try {
        if (!token) return
        const { _id, ...diet } = dietDet;
               
        const response = await axios.post(BASE_API_URL, diet, {
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
        return (error.response?.data?.message || 'Failed to Create DietPlan')
    }
}

export const deleteDietPlan = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete DietPlan";
    }
}
