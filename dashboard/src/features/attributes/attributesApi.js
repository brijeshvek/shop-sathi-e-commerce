import { apiSlice } from '../../app/apiSlice.js'

export const attributesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategoryAttributes: builder.query({
      query: () => '/attributes',
      providesTags: ['Attributes']
    }),
    
    getCategoryAttributes: builder.query({
      query: (categoryId) => `/attributes/category/${categoryId}`,
      providesTags: (result, error, arg) => [{ type: 'Attributes', id: arg }]
    }),
    
    upsertCategoryAttributes: builder.mutation({
      query: ({ categoryId, fields }) => ({
        url: `/attributes/category/${categoryId}`,
        method: 'PUT',
        body: { fields }
      }),
      invalidatesTags: ['Attributes']
    }),
    
    deleteCategoryAttributes: builder.mutation({
      query: (categoryId) => ({
        url: `/attributes/category/${categoryId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Attributes']
    })
  })
})

export const {
  useGetAllCategoryAttributesQuery,
  useGetCategoryAttributesQuery,
  useUpsertCategoryAttributesMutation,
  useDeleteCategoryAttributesMutation
} = attributesApi
