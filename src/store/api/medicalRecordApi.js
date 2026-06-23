import { baseApi } from './baseApi'

export const medicalRecordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMedicalRecord: builder.mutation({
      query: (data) => ({ url: '/records', method: 'POST', body: data }),
      invalidatesTags: ['Record', 'Appointment'],
    }),
    getMyMedicalRecords: builder.query({
      query: () => '/records/my',
      providesTags: ['Record'],
    }),
  }),
})

export const {
  useCreateMedicalRecordMutation,
  useGetMyMedicalRecordsQuery,
} = medicalRecordApi