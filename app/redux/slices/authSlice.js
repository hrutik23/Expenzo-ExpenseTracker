import { createSlice } from "@reduxjs/toolkit";
import { register, login, performLogout } from "../actions/authActions";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
  token: token || null,
  user: user || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastRegisteredEmail = action.payload?.email || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(performLogout.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    });
  },
});

export default authSlice.reducer;
