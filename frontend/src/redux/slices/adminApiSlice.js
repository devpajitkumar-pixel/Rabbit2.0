import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Fetch all users
    fetchUsers: builder.query({
      query: () => "/api/admin/users",
      providesTags: ["User"],
    }),

    // 🔹 Add new user
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/api/admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // 🔹 Update user
    updateUser: builder.mutation({
      query: ({ id, name, email, role }) => ({
        url: `/api/admin/users/${id}`,
        method: "PUT",
        body: { name, email, role },
      }),
      invalidatesTags: ["User"],
    }),

    // 🔹 Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApiSlice;
