import { apiSlice } from '../../app/apiSlice.js'

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerAnalytics: builder.query({
      query: () => '/seller/analytics',
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
  }),
})

export const {
  useGetSellerAnalyticsQuery,
  useGetSellerProductsQuery,
  useGetSellerOrdersQuery,
} = sellerApi
