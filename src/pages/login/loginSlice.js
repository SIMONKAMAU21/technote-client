
const API = import.meta.env.VITE_DOMAIN
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const users = JSON.parse(localStorage.getItem('user'))
console.log('user', users)
const token = users?.token
console.log('token', token)
export const LoginApi = createApi({
    reducerPath: "Login",
    tagTypes: ['users'],
    baseQuery: fetchBaseQuery({ baseUrl: API }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (login) => ({
                url: `users/login`,
                method: "POST",
                body: login,
            })
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: "users",
                method: "GET"
            }),
            providesTags: ['users']
        }),
        addUser: builder.mutation({
            query: (user) => ({
                url: 'users/add',
                method: "POST",
                headers: {
                    Authorization: `JWT ${token}`, 
                },
                body: user,

            }),
            invalidatesTags: ['users']
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags:["users"]
        }),
        updateUser:builder.mutation({
            query:(user)=>({
                url:`users/${user.id}`,
                method:"PUT",
                body:user
            })
        })

    })
})

export const { useLoginMutation, useGetAllUsersQuery, useAddUserMutation,useDeleteUserMutation,useUpdateUserMutation } = LoginApi;