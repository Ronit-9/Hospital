import { baseApi } from './baseApi'

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllNews: builder.query({
      query: () => '/news',
      providesTags: ['News'],
    }),

    getNews: builder.query({
      query: (id) => `/news/${id}`,
      providesTags: ['News'],
    }),

    // CREATE news with image URL
    createNews: builder.mutation({
      query: (newsData) => ({
        url: '/news',
        method: 'POST',
        body: newsData,
      }),
      invalidatesTags: ['News'],
    }),

    // UPDATE news with image URL
    updateNews: builder.mutation({
      query: ({ id, newsData }) => ({
        url: `/news/${id}`,
        method: 'PUT',
        body: newsData,
      }),
      invalidatesTags: ['News'],
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),

    likeNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}/like`,
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