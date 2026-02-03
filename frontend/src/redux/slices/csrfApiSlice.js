import { apiSlice } from "./apiSlice";
import { setCsrfToken } from "./csrfSlice";

export const csrfApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCsrf: builder.query({
      query: () => "/auth/csrf",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCsrfToken(data.csrfToken));
      },
    }),
  }),
});

export const { useGetCsrfQuery } = csrfApiSlice;
