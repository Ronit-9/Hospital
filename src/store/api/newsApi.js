import { baseApi } from './baseApi'

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET all news
    getAllNews: builder.query({
      query: () => 'api/news',
      providesTags: ['News'],
    }),

    // GET single news
    getNews: builder.query({
      query: (id) => `api/news/${id}`,
      providesTags: ['News'],
    }),

    // CREATE news with image
    createNews: builder.mutation({
      query: (formData) => ({
        url: 'api/news',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['News'],
    }),

    // UPDATE news with image
    updateNews: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/news/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['News'],
    }),

    // DELETE news
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `api/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),

    // LIKE news
    likeNews: builder.mutation({
      query: (id) => ({
        url: `api/news/${id}/like`,
        method: 'PUT',
      }),
      invalidatesTags: ['News'],
    }),
  }),
})

export const {
  useGetAllNewsQuery,
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useLikeNewsMutation,
} = newsApi