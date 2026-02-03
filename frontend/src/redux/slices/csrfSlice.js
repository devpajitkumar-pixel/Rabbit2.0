import { createSlice } from "@reduxjs/toolkit";

const csrfSlice = createSlice({
  name: "csrf",
  initialState: {
    token: null,
  },
  reducers: {
    setCsrfToken: (state, action) => {
      state.token = action.payload;
    },
    clearCsrfToken: (state) => {
      state.token = null;
    },
  },
});

export const { setCsrfToken, clearCsrfToken } = csrfSlice.actions;
export default csrfSlice.reducer;
