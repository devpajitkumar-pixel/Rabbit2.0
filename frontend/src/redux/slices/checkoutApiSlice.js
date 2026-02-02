import { apiSlice } from "./apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation({
      query: (checkoutData) => ({
        url: "/api/checkout",
        method: "POST",
        body: checkoutData,
      }),
      invalidatesTags: ["Checkout", "Cart", "Order"],
    }),
  }),
});

export const { useCreateCheckoutMutation } = checkoutApiSlice;
