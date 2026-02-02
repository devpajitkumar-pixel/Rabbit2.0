import { apiSlice } from "./apiSlice";

export const adminOrderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all orders
    fetchAllOrders: builder.query({
      query: () => "/api/admin/orders",
      providesTags: ["Order"],
    }),

    // Update order delivery status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/admin/orders/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    // Delete an order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/api/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useFetchAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = adminOrderApiSlice;
