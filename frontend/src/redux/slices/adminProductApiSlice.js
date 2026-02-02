import { apiSlice } from "./apiSlice";

export const adminProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products
    fetchAdminProducts: builder.query({
      query: () => "/api/admin/products",
      providesTags: ["AdminProduct", "Product"],
    }),

    // Create a product
    // createProduct: builder.mutation({
    //   query: (productData) => ({
    //     url: "/api/admin/products",
    //     method: "POST",
    //     body: productData,
    //   }),
    //   invalidatesTags: ["AdminProduct", "Product"],
    // }),

    // Update a product
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useFetchAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = adminProductApiSlice;
