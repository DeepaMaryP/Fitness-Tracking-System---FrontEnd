import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/user"

export const fetchAllUsers = async (token) => {
    try {
        if (!token) return
        const response = await axios.get(BASE_API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allUsers
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch Users";
    }
}

export const fetchAllActivePaidUsers = async (token) => {
    try {
        if (!token) return      
        const response = await axios.get(`${BASE_API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })       
        return response.data.allUsers
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch Users";
    }
}

export const fetchAllActiveUnAsssignedPaidUsers = async (token) => {
    try {
        if (!token) return      
        const response = await axios.get(`${BASE_API_URL}/unassignedusers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })       
        return response.data.unassignedUsers
    } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        console.log({ error });
        return error.response?.data?.message || "Failed to fetch Users";
    }
}

export const fetchUserWithId = async (id, token) => {
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
        return error.response?.data?.message || "Failed to fetch User";
    }
}

export const updateUser = async (user, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/${user._id}`, user, {
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
        return error.response?.data || "Failed to update user";
    }
}

export const updateUserPassword = async (user, token) => {
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/changepwd/${user._id}`, user, {
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
        return error.response?.data || "Failed to update user password";
    }
}

export const registerNewUser = async (userDet) => {
    try {       
        const { _id, ...user } = userDet;
        const response = await axios.post(`${BASE_API_URL}/register`, user );
        return response.data
    } catch (error) {
        console.log({ error });
        if (error.response && error.response.status === 403 && error.response.data.message === "invalid token") {
            localStorage.removeItem("token")
            window.location.href = '/login';
        }
        return (error.response?.data?.message?.includes('duplicate key error') ? "Email Id exists.Please select a different one"
            : (error.response?.data?.message || 'Failed to Create User'))
    }
}

export const createUser = async (userDet, token) => {
    try {
        if (!token) return
        const { _id, ...user } = userDet;
        const response = await axios.post(BASE_API_URL, user, {
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
        return (error.response?.data?.message?.includes('duplicate key error') ? "Email Id exists.Please select a different one"
            : (error.response?.data?.message || 'Failed to Create User'))
    }
}

export const createUserTrainer = async (userTrainer, token) => {
    try {
        if (!token) return
        const { _id, ...userDet } = userTrainer.user;
        userTrainer.user = userDet // remove the _id

        const response = await axios.post(`${BASE_API_URL}/trainer`, userTrainer, {
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
        return (error.response?.data?.message?.includes('duplicate key error') ? "Email Id exists.Please select a different one"
            : (error.response?.data?.message || 'Failed to Create User'))
    }
}

export const updateUserTrainer = async (userTrainer, token) => {
    const { user } = userTrainer
    try {
        if (!token) return
        const response = await axios.patch(`${BASE_API_URL}/trainer/${user._id}`, userTrainer, {
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
        return (error.response?.data?.message?.includes('duplicate key error') ? "Email Id exists.Please select a different one"
            : (error.response?.data?.message || 'Failed to update User'))
    }
}

export const deleteUser = async (id, token) => {
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
        return error.response?.data?.message || "Failed to delete User";
    }
}
