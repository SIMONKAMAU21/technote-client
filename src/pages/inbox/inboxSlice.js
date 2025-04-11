import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API, LOCAL, socket } from "../../../utils/socket";

const getToken = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  return {
    token: users?.token,
    id: users.id,
  };
};

export const MessageApi = createApi({
  reducerPath: "Message",
  tagTypes: ["messages"],
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
   
    sendMessage: builder.mutation({
      query: (payload) => ({
        url: `/message/add`,
        method: "POST",
        body: { ...payload, senderId: getToken().id },
      }),
    }),
    getAllMessages: builder.query({
      query: () => ({
        url: "/messages",
        method: "GET",
      }),
      providesTags: ["messages"],
      
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          socket.on("messageAdded", (newMessage) => {
            updateCachedData((draft) => {
              draft.push(newMessage);
            });
          });
          socket.on("messageFetched", (messages) => {
            updateCachedData((draft) => {
              return messages;
            });
          });

          socket.on("messageDeleted", (messageId) => {
            updateCachedData((draft) =>
              draft.filter((message) => message._id !== messageId)
            );
          });
        } catch (error) {
          console.log("error", error);
        }
        await cacheEntryRemoved;
        socket.off("messageAdded");
        socket.off("messageFetched");
        socket.off("messageDeleted");
        socket.off("messageUpdated");
      },
    }),

    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `message/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["messages"],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: `user/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    getMessagesBySenderId: builder.query({
      query: () => ({
        url: `/messages/user/${getToken().id}/conversations`,
        method: "GET",
      }),
      providesTags: ["messages"],
    }),
    getMessagesInThread: builder.query({
      query: (id) => ({
        url: `/messages/conversation/${id}`,
        method: "GET",
      }),
      providesTags: ["messages"],
    })
  }),
});

export const {
 useSendMessageMutation,
 useGetAllMessagesQuery,
 useDeleteMessageMutation,
 useGetMessagesBySenderIdQuery,
 useGetMessagesInThreadQuery,
} = MessageApi;
