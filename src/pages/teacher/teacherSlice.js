import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API = import.meta.env.VITE_DOMAIN

export const SubjectApi = createApi({
    reducerPath: "subject",
    tagTypes: ['subjects'],
    baseQuery: fetchBaseQuery({ baseUrl: API }),
    endpoints: (builder) => ({
        getAllsubjects: builder.query({
            query: () => ({
                url: "subjects",
                method: "GET"
            }),
            providesTags: ['subjects']
        }),

        addsubject: builder.mutation({
            query: (subject) => ({
                url: "subject/add",
                method: "POST",
                body: subject

            }),
            invalidatesTags: ['subjects']

        }),
        deletesubject: builder.mutation({
            query: (subject) => ({
                url: `subject/${subject}`,
                method: "DELETE"
            }),
            invalidatesTags: ["subjects"]
        }),
        updatesubject: builder.mutation({
            query: (subject) => ({
                url: `subject/${subject.id}`,
                method: "PUT",
                body: subject

            }),
            invalidatesTags:["subjects"]
        })
    })
})

export const { useGetAllsubjectsQuery, useAddsubjectMutation, useDeletesubjectMutation,useUpdatesubjectMutation } = SubjectApi;