import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../../../utils/socket";
import { getToken } from "../../../utils/AuthContext";

export const StudentApi = createApi({
  reducerPath: "Student",
  tagTypes: ["students"],
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers) => {
      const token = getToken().token;
      if (token) {
        headers.set("Authorization", `JWT ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllStudents: builder.query({
      query: () => ({
        url: "students",
        method: "GET",
      }),
      providesTags: ["students"],
    }),

    addStudent: builder.mutation({
      query: (student) => ({
        url: "student/add",
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["students"],
    }),
    deleteStudent: builder.mutation({
      query: (student) => ({
        url: `student/${student}`,
        method: "DELETE",
      }),
      invalidatesTags: ["students"],
    }),
    updateStudent: builder.mutation({
      query: (student) => ({
        url: `student/${student.id}`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["students"],
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useAddStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} = StudentApi;
