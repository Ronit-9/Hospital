import { baseApi } from './baseApi'

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getServices: builder.query({
      query: () => 'api/services',
      providesTags: ['Service'],
    }),
    getService: builder.query({
      query: (id) => `api/services/${id}`,
      providesTags: ['Service'],
    }),

    // Admin
    getAllServices: builder.query({
      query: () => 'api/services', // adjust if your admin route differs
      providesTags: ['Service'],
    }),
    createService: builder.mutation({
      query: (body) => ({
        url: 'api/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `api/services/${id}`,
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