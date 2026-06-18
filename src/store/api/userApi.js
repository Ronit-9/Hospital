import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/auth',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetAllUsersQuery } = userApi