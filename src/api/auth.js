import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API_URL = "http://localhost:3000/api/user"

export const signIn = createAsyncThunk("signIn", async (credentials, { rejectWithValue }) => {
    try {                      
        const { data } = await axios.post(`${BASE_API_URL}/login`, credentials)
        return data
    } catch (error) {
        console.log({ error });
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
})

