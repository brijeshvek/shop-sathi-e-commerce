import { apiSlice } from '../../app/apiSlice.js'

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerAnalytics: builder.query({
      query: () => '/seller/analytics',
      providesTags: ['Analytics'],
    }),
    getSellerRevenueChart: builder.query({
      query: (params) => ({ url: '/seller/analytics/revenue', params }),
      providesTags: ['Analytics'],
    }),
    getSellerProducts: builder.query({
      query: (params) => ({ url: '/seller/products', params }),
      providesTags: ['Product'],
    }),
    getSellerOrders: builder.query({
      query: (params) => ({ url: '/seller/orders', params }),
      providesTags: ['Order'],
    }),
    updateSellerOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/seller/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order', 'Analytics'],
    }),
  }),
})

export const {
  useGetSellerAnalyticsQuery,
  useGetSellerRevenueChartQuery,
  useGetSellerProductsQuery,
  useGetSellerOrdersQuery,
  useUpdateSellerOrderStatusMutation,
} = sellerApi
