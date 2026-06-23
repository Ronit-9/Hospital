import { baseApi } from './baseApi'

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Patient
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: '/appointments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointment'],
    }),
    getMyAppointments: builder.query({
      query: () => '/appointments/my',
      providesTags: ['Appointment'],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}/cancel`,
        method: 'PUT',            // ← was DELETE, router expects PUT
      }),
      invalidatesTags: ['Appointment'],
    }),

    // Admin
    getAllAppointments: builder.query({
      query: () => '/appointments',
      providesTags: ['Appointment'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `/appointments/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointment'],
    }),

    // Doctor
    getDoctorAppointments: builder.query({
      query: (doctorId) => `/appointments/doctor/${doctorId}`,
      providesTags: ['Appointment'],
    }),
  }),
})

export const {
  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useCancelAppointmentMutation,
  useGetAllAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
  useGetDoctorAppointmentsQuery,
} = appointmentApi