import { apiSlice } from '../../app/apiSlice.js'

export const supportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: (params) => ({
        url: '/tickets',
        params,
      }),
      providesTags: ['Ticket'],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tickets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
    addTicketReply: builder.mutation({
      query: ({ id, message }) => ({
        url: `/tickets/${id}/reply`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useUpdateTicketStatusMutation,
  useAddTicketReplyMutation,
} = supportApi
