import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API, LOCAL, socket } from "../../../utils/socket";

const getToken = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  return users?.token;
};

export const LoginApi = createApi({
  reducerPath: "Login",
  tagTypes: ["users"],
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `JWT ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (login) => ({
        url: `users/login`,
        method: "POST",
        body: login,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["users"],
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          socket.on("userAdded", (newUser) => {
            updateCachedData((draft) => {
              draft.push(newUser);
            });
          });
          socket.on("userFetched", (users) => {
            updateCachedData((draft) => {
              return users;
            });
          });

          socket.on("userDeleted", (userId) => {
            updateCachedData((draft) =>
              draft.filter((user) => user._id !== userId)
            );
          });
        } catch (error) {
          console.log("error", error);
        }
        await cacheEntryRemoved;
        socket.off("userAdded");
      },
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "users/add",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: `user/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAllUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = LoginApi;
