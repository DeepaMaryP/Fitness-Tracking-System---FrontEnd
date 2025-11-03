import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "../../api/auth";

const initialState = {
    userName: null,
    userId: null,
    status: "",
    token: null,
    error: null,
    isSubscribed: false,
    isLoggedIn : false
}

const authSlice = createSlice(
    {
        name: 'auth',
        initialState: initialState,
        reducers: {
            setIsSubscribed(state, action) {
                state.isSubscribed = action.payload
            },
            logout(state) {
                state.userName = null;
                state.userId = null;
                state.token = null;
                state.status = "";
                state.error = null;
                state.isSubscribed = false;
                state.isLoggedIn = false;
                if (localStorage.getItem("token")) {
                    localStorage.removeItem("token")
                }
            },
        },
        extraReducers: (builder) => {
            builder.addCase(signIn.pending, (state,) => {
                state.status = "pending";
                state.error = null;
            }).addCase(signIn.fulfilled, (state, action) => {
                state.status = "success";
                state.token = action.payload.data.token;
                state.userName = action.payload.data.name;
                state.userId = action.payload.data.userId;
                state.role = action.payload.data.role;
                state.isSubscribed = action.payload.isSubscribed;
                state.isLoggedIn = true;
                localStorage.setItem("token", action.payload.data.token);
            }).addCase(signIn.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
        }
    }
)

export const { logout, setIsSubscribed } = authSlice.actions
export default authSlice.reducer