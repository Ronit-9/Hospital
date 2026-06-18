import { baseApi } from './baseApi'

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─── Public ───────────────────────────────────────────

    getDoctors: builder.query({
      query: () => '/doctors',
      providesTags: ['Doctor'],
    }),
    getDoctor: builder.query({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),
    getDoctorsByDepartment: builder.query({
      query: (departmentId) => `/doctors/department/${departmentId}`,
      providesTags: ['Doctor'],
    }),

    // ─── Admin ────────────────────────────────────────────

    // body shape: { name, specialty, department, image: "https://..." }
    createDoctor: builder.mutation({
      query: (doctorData) => ({
        url: '/doctors',
        method: 'POST',
        body: doctorData, // image is just a URL string field inside doctorData
      }),
      invalidatesTags: ['Doctor'],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, doctorData }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: doctorData, // pass image inside doctorData: { ...fields, image: "https://..." }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Doctor', id },
        'Doctor',
      ],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Doctor', id },
        'Doctor',
      ],
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