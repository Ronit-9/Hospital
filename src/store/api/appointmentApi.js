import { baseApi } from './baseApi'

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Patient
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: 'api/appointments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointment'],
    }),
    getMyAppointments: builder.query({
      query: () => 'api/appointments/my',
      providesTags: ['Appointment'],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `api/appointments/${id}/cancel`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointment'],
    }),

    // Admin
    getAllAppointments: builder.query({
      query: () => 'api/appointments',
      providesTags: ['Appointment'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/appointments/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `api/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointment'],
    }),

    // Doctor
    getDoctorAppointments: builder.query({
      query: (doctorId) => `api/appointments/doctor/${doctorId}`,
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