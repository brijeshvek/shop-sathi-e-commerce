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
    updateItemReturnStatus: builder.mutation({
      query: ({ orderId, itemId, status }) => ({
        url: `/orders/${orderId}/items/${itemId}/return-status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    updateItemExchangeStatus: builder.mutation({
      query: ({ orderId, itemId, status }) => ({
        url: `/orders/${orderId}/items/${itemId}/exchange-status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateItemReturnStatusMutation,
  useUpdateItemExchangeStatusMutation,
} = ordersApi
