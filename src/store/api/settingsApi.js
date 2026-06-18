import { baseApi } from './baseApi'

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
  }),
})

export const { useGetSettingsQuery } = settingsApi