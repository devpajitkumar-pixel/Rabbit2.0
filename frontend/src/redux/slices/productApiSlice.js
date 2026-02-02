import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch products with filters
    fetchProducts: builder.query({
      query: (filters) => ({
        url: "/api/products",
        params: filters,
      }),
      providesTags: ["Product"],
    }),

    // Fetch single product details
    fetchProductDetails: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: ["Product"],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Fetch similar products
    fetchSimilarProducts: builder.query({
      query: (id) => `/api/products/similar/${id}`,
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useUpdateProductMutation,
  useFetchSimilarProductsQuery,
} = productApiSlice;
