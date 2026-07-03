import { apiSlice } from '../../app/apiSlice.js'

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getCustomerById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    blockCustomer: builder.mutation({
      query: ({ id, isBlocked }) => ({
        url: `/users/${id}/block`,
        method: 'PUT',
        body: { isBlocked },
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}/password`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useBlockCustomerMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = customersApi
