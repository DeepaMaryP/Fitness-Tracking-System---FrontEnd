import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API_URL = "https://fitness-tracking-system-back-end.vercel.app/api/user"
const BASE_API_PAYMENTURL = "https://fitness-tracking-system-back-end.vercel.app/api/userpayment"

export const signIn = createAsyncThunk("signIn", async (credentials, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BASE_API_URL}/login`, credentials)
        const data =  res.data;
        const { userId, token } = data

        const subRes = await axios.get(`${BASE_API_PAYMENTURL}/check-subscription/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });   

        return { data, isSubscribed: subRes.data.isSubscribed };       
    } catch (error) {
        console.log({ error });
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
})

