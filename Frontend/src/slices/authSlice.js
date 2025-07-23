import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    userInfo : localStorage.getItem("userInfo")? JSON.parse(localStorage.getItem("userInfo")) : null ,
    authToken : localStorage.getItem("authToken") ? localStorage.getItem("authToken") : null
    
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload.user;
            localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
            state.authToken = action.payload.token;
            localStorage.setItem("authToken", action.payload.token);
        },
        logOut: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
            state.authToken = null;
            localStorage.removeItem("authToken");
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;