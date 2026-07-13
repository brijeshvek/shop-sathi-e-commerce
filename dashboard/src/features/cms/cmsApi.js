import { apiSlice } from '../../app/apiSlice.js'

export const cmsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Blogs
    getBlogs: builder.query({
      query: (params) => ({
        url: '/cms/blogs',
        params,
      }),
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation({
      query: (data) => ({
        url: '/cms/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cms/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/cms/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),

    // FAQs
    getFaqs: builder.query({
      query: (params) => ({
        url: '/cms/faqs',
        params,
      }),
      providesTags: ['Faq'],
    }),
    createFaq: builder.mutation({
      query: (data) => ({
        url: '/cms/faqs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Faq'],
    }),
    updateFaq: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cms/faqs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Faq'],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/cms/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
    }),

    // CMS Pages
    getCmsPages: builder.query({
      query: (params) => ({
        url: '/cms/pages',
        params,
      }),
      providesTags: ['CmsPage'],
    }),
    createCmsPage: builder.mutation({
      query: (data) => ({
        url: '/cms/pages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CmsPage'],
    }),
    updateCmsPage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cms/pages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CmsPage'],
    }),
    deleteCmsPage: builder.mutation({
      query: (id) => ({
        url: `/cms/pages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CmsPage'],
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  
  useGetCmsPagesQuery,
  useCreateCmsPageMutation,
  useUpdateCmsPageMutation,
  useDeleteCmsPageMutation,
} = cmsApi
