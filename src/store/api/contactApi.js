import { baseApi } from './baseApi'

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),
    getAllMessages: builder.query({
      query: () => '/contact',
      providesTags: ['Contact'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Contact'],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
})

export const {
  useSendMessageMutation,
  useGetAllMessagesQuery,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} = contactApi