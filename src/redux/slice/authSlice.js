import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "../../api/auth";

const initialState = {
    userName: null,
    status: "",
    token: null,
    error: null,
}

const authSlice = createSlice(
    {
        name: 'auth',
        initialState: initialState,
        reducers: {
            logout(state) {
                state.userName = null;
                state.token = null;
                state.status = "";
                state.error = null;
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
                state.token = action.payload.token;
                state.userName = action.payload.name;
                localStorage.setItem("token", action.payload.token);
            }).addCase(signIn.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
        }
    }
)

export const { logout } = authSlice.actions
export default authSlice.reducer