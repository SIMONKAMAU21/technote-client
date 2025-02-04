
const API = import.meta.env.VITE_DOMAIN
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
            providesTags: ['events']
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
            query: (eventId) => ({
                url: `event/${eventId}`,
                method: "DELETE"
            }),
            invalidatesTags:["events"]
        }),
        updateEvent:builder.mutation({
            query:(event)=>({
                url:`event/${event.id}`,
                method:"PUT",
                body:event
            }),
            invalidatesTags:["events"]

        })

    })
})

export const { useAddEventMutation,useGetAllEventsQuery,useDeleteEventMutation,useUpdateEventMutation } = eventApi;