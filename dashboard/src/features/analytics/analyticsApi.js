import { apiSlice } from '../../app/apiSlice.js'

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/analytics/dashboard',
      providesTags: ['Analytics', 'Order', 'Product', 'User'],
    }),
    getRevenueChart: builder.query({
      query: (params) => ({
        url: '/analytics/revenue',
        params,
      }),
      providesTags: ['Analytics'],
    }),
    getTopProducts: builder.query({
      query: (params) => ({
        url: '/analytics/top-products',
        params,
      }),
      providesTags: ['Analytics'],
    }),
    getOrdersChart: builder.query({
      query: (params) => ({
        url: '/analytics/orders',
        params,
      }),
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
  useGetTopProductsQuery,
  useGetOrdersChartQuery,
} = analyticsApi
