import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const StudentApi = createApi({
    reducerPath: "Student",
    tagTypes: ['students'],
    baseQuery: fetchBaseQuery({ baseUrl: 'https://technotes-1w0k.onrender.com/api/' }),
    endpoints: (builder) => ({
        getAllStudents: builder.query({
            query: () => ({
                url: "students",
                method: "GET"
            }),
            providesTags: ['students']
        }),

        addStudent: builder.mutation({
            query: (student) => ({
                url: "student/add",
                method: "POST",
                body: student

            })
        })
    })
})

export const { useGetAllStudentsQuery,useAddStudentMutation } = StudentApi;