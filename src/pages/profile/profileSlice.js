const API = import.meta.env.VITE_DOMAIN;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const LOCAL = import.meta.env.VITE_LOCAL_DOMAIN;

const getToken = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  return users;
};

export const profileApi = createApi({
  reducerPath: "profile",
  tagTypes: ["profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: LOCAL,
    prepareHeaders: (headers) => {
      const token = getToken()?.token;
      if (token) {
        headers.set("Authorization", `JWT ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
   getUserProfile: builder.mutation({
      query: () => {
        const id = getToken()?.id;
        return {
          url: `/user`,
          method: "POST",
          body: { id },
        };
      },
      providesTags: ['profile']

    }),

    updatePassword: builder.mutation({
      query: (payload) => {
        const id = getToken()?.id;
        return {
          url: `user/password/${id}`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["profile"],
    }),
    uploadImage: builder.mutation({
      query: (payload) => {
        const id = getToken()?.id;
        return{
          url: `/user/${id}/upload-photo`,
          method: "POST",
          body: payload,
        }
      
      },
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {useGetUserProfileMutation, useUploadImageMutation, useUpdatePasswordMutation } = profileApi;
