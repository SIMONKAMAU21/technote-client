import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const LoginApi =createApi({
reducerPath:"Login",
tagTypes:['users'],
baseQuery:fetchBaseQuery({baseUrl:'https://technotes-1w0k.onrender.com/api/'}),
endpoints:(builder)=>({
    login: builder.mutation({
        query:(login)=>({
            url:`users/login`,
            method:"POST",
            body:login,
        })
    }),
    getAllUsers:builder.query({
        query:()=>({
            url:"users",
            method:"GET"
        }),
        invalidatesTags:['users']
    })
    
})
})

export const{useLoginMutation,useGetAllUsersQuery}=LoginApi;