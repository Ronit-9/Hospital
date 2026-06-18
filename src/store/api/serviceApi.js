import { baseApi } from './baseApi'

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─── Public ───────────────────────────────────────────

    getServices: builder.query({
      query: () => '/services',
      providesTags: ['Service'],
    }),
    getService: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),

    // ─── Admin ────────────────────────────────────────────

    getAllServices: builder.query({
      query: () => '/services/admin/all',
      providesTags: ['Service'],
    }),

    // body shape: { name, description, icon, image: "https://..." }
    createService: builder.mutation({
      query: (serviceData) => ({
        url: '/services',
        method: 'POST',
        body: serviceData, // image is just a URL string field inside serviceData
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation({
      query: ({ id, serviceData }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: serviceData, // pass image inside serviceData: { ...fields, image: "https://..." }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        'Service',
      ],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Service', id },
        'Service',
      ],
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