import { apiSlice } from '../../app/apiSlice.js'

export const couponsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => '/coupons',
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: '/coupons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/coupons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    toggleCouponStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/coupons/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
})

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useToggleCouponStatusMutation,
  useDeleteCouponMutation,
} = couponsApi
