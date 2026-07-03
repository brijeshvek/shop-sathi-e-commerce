import { apiSlice } from '../../app/apiSlice.js'

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, orderStatus, note }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { orderStatus, note },
      }),
      invalidatesTags: ['Order', 'Analytics'],
    }),
  }),
})

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi
