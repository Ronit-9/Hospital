import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://localhost:5000/api',
    baseUrl: 'https://hospital-vmds.onrender.com/api',
    credentials: 'include',
  }),
  tagTypes: ['User', 'Doctor', 'Appointment', 'Department', 'Review', 'Payment', 'Record'],
  endpoints: () => ({}),
})