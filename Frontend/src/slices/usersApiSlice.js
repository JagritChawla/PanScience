
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login: builder.mutation({
            query: (data)=>({
                url: "/users/login",
                method:'POST',
                body: data
            })
        }),
        register : builder.mutation({
            query: (data)=>({
                url: "/users/register",
                method:'POST',
                body: data
            })
        }),
        getAllUsers : builder.query({
            query : (params = {}) => ({
                url: '/users',
                method: 'GET',
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10
                }
            }), 
        }),
        adminUpdateUserRole: builder.mutation({ 
            query: ({ id, role }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: { role }
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE'
            }),
        }),
        updateMyCredentials: builder.mutation({
            query: (formData) => ({
                url: '/users/mine',
                method: 'PUT',
                body: formData,
            }),
        })
    })
})

export const {useLoginMutation, useRegisterMutation , useGetAllUsersQuery , useAdminUpdateUserRoleMutation , useDeleteUserMutation, useUpdateMyCredentialsMutation}  = userApiSlice;