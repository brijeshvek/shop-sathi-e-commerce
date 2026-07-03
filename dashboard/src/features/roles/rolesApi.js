import { apiSlice } from '../../app/apiSlice.js'

export const rolesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRolePermissions: builder.query({
            query: (roleName) => `/roles/${roleName}`,
            providesTags: (result, error, arg) => [{ type: 'Role', id: arg }],
        }),
        updateRolePermissions: builder.mutation({
            query: ({ roleName, permissions }) => ({
                url: `/roles/${roleName}`,
                method: 'PUT',
                body: permissions,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Role', id: arg.roleName }],
        }),
    }),
})

export const {
    useGetRolePermissionsQuery,
    useUpdateRolePermissionsMutation,
} = rolesApi