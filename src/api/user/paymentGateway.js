import axios from "axios";

const BASE_API_URL = "https://fitness-tracking-system-back-end.vercel.app/api/payment"

export const orderPayment = async (order, token) => {
    try {
        if (!token) return
        const response = await axios.post(BASE_API_URL, order, {
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
        return (error.response?.data?.message || 'Payment initiation failed')
    }
}

export const verifyPayment = async (order, token) => {
    try {
        if (!token) return
        const response = await axios.post(`${BASE_API_URL}/verify`, order, {
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
        return (error.response?.data?.message || 'Payment verification failed')
    }
}