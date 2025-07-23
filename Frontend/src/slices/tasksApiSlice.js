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
    })
})

export const { useGetMyTasksQuery } = taskApiSlice;