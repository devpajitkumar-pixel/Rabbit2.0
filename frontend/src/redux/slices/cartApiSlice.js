import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch cart (user OR guest)
    fetchCart: builder.query({
      query: ({ userId, guestId }) => ({
        url: "/api/cart",
        params: { userId, guestId },
      }),
      providesTags: ["Cart"],
    }),

    // Add to cart
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/api/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update cart item quantity
    updateCartItemQuantity: builder.mutation({
      query: (data) => ({
        url: "/api/cart",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: "/api/cart",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Merge guest cart → user cart
    mergeCart: builder.mutation({
      query: ({ user, guestId }) => ({
        url: "/api/cart/merge",
        method: "POST",
        body: { user, guestId },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useFetchCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation,
  useMergeCartMutation,
} = cartApiSlice;
