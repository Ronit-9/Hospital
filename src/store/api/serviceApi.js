import { baseApi } from './baseApi'

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getServices: builder.query({
      query: () => '/services',
      providesTags: ['Service'],
    }),
    getService: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: ['Service'],
    }),

    // Admin
    getAllServices: builder.query({
      query: () => '/services', // adjust if your admin route differs
      providesTags: ['Service'],
    }),
    createService: builder.mutation({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi