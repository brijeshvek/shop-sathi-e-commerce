import { apiSlice } from '../../app/apiSlice.js'

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductsAdmin: builder.query({
      query: (params) => ({
        url: '/products/admin/list',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductByIdAdmin: builder.query({
      query: (id) => `/products/admin/${id}`,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product', 'Analytics'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product', 'Analytics'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Analytics'],
    }),
    toggleProductStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/products/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Product', 'Analytics'],
    }),
  }),
})

export const {
  useGetProductsAdminQuery,
  useGetProductByIdAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} = productsApi
