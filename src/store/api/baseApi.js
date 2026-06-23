import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const base = "https://hospital-vmds.onrender.com"

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://localhost:5000/api',
    baseUrl: `${base}/api`,
    credentials: 'include',
  }),
  tagTypes: ['User', 'Doctor', 'Appointment', 'Department', 'Review', 'Payment', 'Record'],
  endpoints: () => ({}),
})