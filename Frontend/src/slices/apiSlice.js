import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react";
const BASE_URL = "http://localhost:3000/api/";

const baseQuery = fetchBaseQuery({
    baseUrl : BASE_URL,
    prepareHeaders: (headers)=>{
        const token = localStorage.getItem("authToken");
        if(token){
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

export const apiSlice = createApi({
    baseQuery,
    endpoints: (builder)=>({})
})