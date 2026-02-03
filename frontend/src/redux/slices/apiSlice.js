import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = getState().csrf.token;
    if (csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },

  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Cart", "Checkout"],
  endpoints: (builder) => ({}),
});
