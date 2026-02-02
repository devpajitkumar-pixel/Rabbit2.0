// redux/api/orderApiSlice.js
import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/orders/my-orders
    getMyOrders: builder.query({
      query: () => "/api/orders/my-orders",
      providesTags: ["Order"],
    }),

    // GET /api/orders/:id
    getOrderDetails: builder.query({
      query: (orderId) => `/api/orders/${orderId}`,
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetOrderDetailsQuery } = orderApiSlice;
