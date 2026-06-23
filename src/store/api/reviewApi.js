import { baseApi } from './baseApi'

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Doctor'],
    }),
    getDoctorReviews: builder.query({
      query: (doctorId) => `/reviews/doctor/${doctorId}`,
      providesTags: ['Review'],
    }),
  }),
})

export const { useCreateReviewMutation, useGetDoctorReviewsQuery } = reviewApi