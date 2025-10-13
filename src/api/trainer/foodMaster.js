import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/foodMaster"

export const fetchAllFoodMaster = async (token) => {
    try {
        if (!token) return        
        const response = await axios.get(BASE_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allFoodMaster
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch FoodMaster";
    }
}

export const fetchFoodMasterWithId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch FoodMaster";
    }
}

export const updateFoodMaster  = async (food, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${food._id}`, food, {
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
        return error.response?.data?.message || "Failed to update FoodMaster";
    }
}

export const createFoodMaster = async (foodDet, token) => {
    try {
        if (!token) return
        console.log(foodDet);
        
        const { _id, ...food } = foodDet;
        const response = await axios.post(BASE_API_URL, food, {
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
        return (error.response?.data?.message || 'Failed to Create FoodMaster')
    }
}


export const deleteFoodMaster = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete FoodMaster";
    }
}