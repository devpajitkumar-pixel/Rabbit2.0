import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers) => {
    // CSRF
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrfToken="))
      ?.split("=")[1];

    console.log(csrfToken);

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
