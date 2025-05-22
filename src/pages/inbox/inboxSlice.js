import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API, LOCAL, socket } from "../../../utils/socket";
import { getToken } from "../../../utils/AuthContext";


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
      invalidatesTags: ["messages"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          socket.emit("messageAdded", data);
          socket.emit("messageSent", data);
        } catch (error) {
          console.log("error", error);
        }
      },
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          socket.on("messageAdded", (message) => {
            // console.log("Got message data", message);
            updateCachedData((draft) => {
              if (Array.isArray(message)) {
                message.forEach((msg) => {
                  const exists = draft.find((m) => m._id === msg._id);
                  if (!exists) {
                    draft.push(msg);
                  }
                });
              } else {
                const exists = draft.find((m) => m._id === message._id);
                if (!exists) {
                  draft.push(message);
                }
              }
            });
          });
        } catch (error) {
          console.log("error", error);
        }
        await cacheEntryRemoved;
        socket.off("messageFetched");
      },
    }),
    getAllMessages: builder.query({
      query: () => ({
        url: "/messages",
        method: "GET",
      }),
      providesTags: ["messages"],
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
    getConversationsByUser: builder.query({
      query: () => ({
        url: `/messages/user/${getToken().id}/conversations`,
        method: "GET",
      }),
      providesTags: ["messages"],
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          socket.on("userConversationsFetched", (populated) => {
            // console.log("Got conversation data", populated);
            updateCachedData((draft) => {
              if (Array.isArray(populated)) {
                populated.forEach((msg) => {
                  const exists = draft.find(
                    (p) => p.conversationId === msg.conversationId
                  );
                  if (!exists) {
                    draft.push(msg);
                  }
                });
              } else {
                draft.push(populated); // or draft.unshift(messages) if new should come first
              }
            });
          });
        } catch (error) {
          console.log("error", error);
        }
        await cacheEntryRemoved;
        socket.off("userConversationsFetched");
        // socket.off("messageFetched");
        // socket.off("messageDeleted");
        // socket.off("messageUpdated");
      },
    }),
    getMessagesInThread: builder.query({
      query: (id) => ({
        url: `/messages/conversation/${id}`,
        method: "GET",
      }),

      providesTags: ["messages"],
      // async onCacheEntryAdded(
      //   _,
      //   { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      // ) {
      //   try {
      //     await cacheDataLoaded;
      //     socket.on("messagesInConversationFetched", (messages) => {
      //       console.log("Got message data", messages);
      //       updateCachedData((draft) => {
      //         if (Array.isArray(messages)) {
      //           messages.forEach((msg) => {
      //             const exists = draft.find((m) => m._id === msg._id);
      //             if (!exists) {
      //               draft.push(msg);
      //             }
      //           });
      //         } else {
      //           const exists = draft.find((m) => m._id === messages._id);
      //           if (!exists) {
      //             draft.push(messages);
      //           }
      //         }
      //       });
      //     });
      //   } catch (error) {
      //     console.log("error", error);
      //   }
      //   await cacheEntryRemoved;
      //   // socket.off("messagesInConversationFetched");`
      //   // socket.off("messageFetched");
      //   // socket.off("messageDeleted");
      //   // socket.off("messageUpdated");
      // },
    }),
    deleteConversation: builder.mutation({
      query: (payload) => ({
        url: `/messages/conversation/${getToken().id}/${
          payload.conversationId
        }`,
        method: "PATCH",
      }),
      invalidatesTags: ["messages"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetAllMessagesQuery,
  useDeleteMessageMutation,
  useGetConversationsByUserQuery,
  useGetMessagesInThreadQuery,
  useDeleteConversationMutation,
} = MessageApi;
