const API = import.meta.env.VITE_DOMAIN;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  return users;
};
const user = getToken();
const id = user?.id;
console.log("id", id);
export const profileApi = createApi({
  reducerPath: "profile",
  tagTypes: ["profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers) => {
      const token = user?.token;
      if (token) {
        headers.set("Authorization", `JWT ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
   getUserProfile: builder.query({
      query: () => ({
        url: `users/${id}`,
        method: "GET",
      }),
    }),

    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `user/password/${id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["profile"],
    }),
    uploadImage: builder.mutation({
      query: (payload) => ({
        url: `/user/${id}/upload-photo`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {useGetUserProfileQuery, useUploadImageMutation, useUpdatePasswordMutation } = profileApi;
