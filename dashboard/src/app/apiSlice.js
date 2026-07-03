import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = import.meta.env.VITE_API_URL || '/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  }),
  tagTypes: ['User', 'Product', 'Order', 'Category', 'Coupon', 'Analytics'],
  endpoints: () => ({}),
})
