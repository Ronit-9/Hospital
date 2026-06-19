import { baseApi } from './baseApi'

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─── Public ───────────────────────────────────────────

    getDepartments: builder.query({
      query: () => '/departments',
      providesTags: ['Department'],
    }),
    getDepartment: builder.query({
      query: (id) => `/departments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),

    // ─── Admin ────────────────────────────────────────────

    // body shape: { name, description, icon, image: "https://..." }
    createDepartment: builder.mutation({
      query: (departmentData) => ({
        url: '/departments',
        method: 'POST',
        body: departmentData,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, departmentData }) => ({
        url: `/departments/${id}`,
        method: 'PUT',
        body: departmentData, // pass image inside departmentData: { ...fields, image: "https://..." }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Department', id },
        'Department',
      ],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Department', id },
        'Department',
      ],
    }),
  }),
})

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi