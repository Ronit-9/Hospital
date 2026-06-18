import { baseApi } from './baseApi'

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: () => '/doctors',
      providesTags: ['Doctor'],
    }),
    getDoctor: builder.query({
      query: (id) => `/doctors/${id}`,
      providesTags: ['Doctor'],
    }),
    getDoctorsByDepartment: builder.query({
      query: (departmentId) => `/doctors/department/${departmentId}`,
      providesTags: ['Doctor'],
    }),
    createDoctor: builder.mutation({
      query: (data) => ({
        url: '/doctors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Doctor'],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Doctor'],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctor'],
    }),
  }),
})

export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useGetDoctorsByDepartmentQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi