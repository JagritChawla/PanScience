

import { apiSlice } from "./apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyTasks: builder.query({
            query: (params = {}) => ({
                url: "/tasks/my",
                method: 'GET',
                params: {
                    status: params.status || '',
                    priority: params.priority || '',
                    sort: params.sort || 'dueDate:asc',
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            }),
            providesTags: ['Task']
        }),
        createTask: builder.mutation({
            query: (formData) => ({
                url: '/tasks',
                method: 'POST',
                body: formData,
                // Headers are set automatically by prepareHeaders
            }),
            invalidatesTags: ['Task']
        }),
        getTaskById : builder.query({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'GET'
            }),
        }),
        getAllTasks: builder.query({
            query: (params = {}) => ({
                url: '/tasks',
                method: 'GET',
                params: {
                    status: params.status || '',
                    priority: params.priority || '',
                    sort: params.sort || 'dueDate:asc',
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            }),
        }),
        updateTask: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Task']
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Task']
        })
        
    })
})

export const { useGetMyTasksQuery,useCreateTaskMutation, useGetTaskByIdQuery , useGetAllTasksQuery , useUpdateTaskMutation , useDeleteTaskMutation } = taskApiSlice;