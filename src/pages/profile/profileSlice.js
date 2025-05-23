import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../../utils/AuthContext";
import { API } from "../../../utils/socket";


export const profileApi = createApi({
  reducerPath: "profile",
  tagTypes: ["profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: API,
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
      invalidatesTags: ['profile']

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
