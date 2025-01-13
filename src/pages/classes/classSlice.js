
const API = import.meta.env.VITE_DOMAIN
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const classes = JSON.parse(localStorage.getItem('user'))
const token = classes?.token

export const ClassApi = createApi({
    reducerPath: "Class",
    tagTypes: ['classes'],
    baseQuery: fetchBaseQuery({ baseUrl: API }),
    endpoints: (builder) => ({
  
        getAllclasses: builder.query({
            query: () => ({
                url: "classes",
                method: "GET"
            }),
            providesTags: ['classes']
        }),
        addClass: builder.mutation({
            query: (classes) => ({
                url: 'class/add',
                method: "POST",
                headers: {
                    Authorization: `JWT ${token}`, 
                },
                body: classes,

            }),
            invalidatesTags: ['classes']
        }),
        deleteClass: builder.mutation({
            query: (classId) => ({
                url: `class/${classId}`,
                method: "DELETE"
            }),
            invalidatesTags:["classes"]
        }),
        updateClass:builder.mutation({
            query:(unit)=>({
                url:`class/${unit.id}`,
                method:"PUT",
                body:unit
            }),
            invalidatesTags: ['classes']

        })

    })
})

export const { useGetAllclassesQuery,useAddClassMutation,useDeleteClassMutation,useUpdateClassMutation } = ClassApi;