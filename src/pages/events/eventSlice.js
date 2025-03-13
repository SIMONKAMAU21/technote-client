
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { io } from 'socket.io-client'

const API = import.meta.env.VITE_DOMAIN
const LOCAL = import.meta.env.VITE_LOCAL_DOMAIN
const LOCAL_BASE = API.replace('/api', '')

export const socket = io(LOCAL_BASE)

const users = JSON.parse(localStorage.getItem('user'))
const token = users?.token
export const eventApi = createApi({
    reducerPath: "Event",
    tagTypes: ['events'],
    baseQuery: fetchBaseQuery({ baseUrl: API }),
    endpoints: (builder) => ({
        
        getAllEvents: builder.query({
            query: () => ({
                url: "events",
                method: "GET",
                  headers: {
                    Authorization: `JWT ${token}`, 
                },
            }),
            providesTags: ['events'],
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;

                    // Listen for real-time event updates
                    socket.on('eventAdded', (newEvent) => {
                        updateCachedData((draft) => {
                            draft.push(newEvent);
                        });
                    });

                    socket.on('eventDeleted', (eventId) => {
                        updateCachedData((draft) => draft.filter(event => event._id !== eventId));
                    });

                    socket.on('eventUpdated', (updatedEvent) => {
                        updateCachedData((draft) => {
                            const index = draft.findIndex(event => event._id === updatedEvent._id);
                            if (index !== -1) {
                                draft[index] = updatedEvent;
                            }
                        });
                    });
                } catch (error) {
                    console.error('Socket.io error:', error);
                }
                await cacheEntryRemoved;
                socket.off('eventAdded');
                socket.off('eventDeleted');
                socket.off('eventUpdated');
            }
        }),
        addEvent: builder.mutation({
            query: (user) => ({
                url: 'event/add',
                method: "POST",
                headers: {
                    Authorization: `JWT ${token}`, 
                },
                body: user,

            }),
            invalidatesTags: ['events']
        }),
        deleteEvent: builder.mutation({
            query: (payload) => ({
                url: `event/${payload?.id}`,
                method: "DELETE"
            }),
            invalidatesTags:["events"]
        }),
        updateEvent:builder.mutation({
            query:(event)=>({
                url:`event/${event.id}`,
                method:"PUT",
                body:event,
                headers:{
                    Authorization:`JWT ${token}`
                }
            }),
            invalidatesTags:["events"]

        })

    })
})

export const { useAddEventMutation,useGetAllEventsQuery,useDeleteEventMutation,useUpdateEventMutation } = eventApi;