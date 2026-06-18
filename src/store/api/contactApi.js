import { baseApi } from './baseApi'

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: 'api/contact',
        method: 'POST',
        body: data,
      }),
    }),
    getAllMessages: builder.query({
      query: () => 'api/contact',
      providesTags: ['Contact'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `api/contact/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Contact'],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `api/contact/${id}`,
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