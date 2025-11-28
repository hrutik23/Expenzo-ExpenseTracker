import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/api/auth/register", userData);
      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Registration failed");
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/api/auth/login", credentials);

      if (!res.data.success) {
        // Reject with backend message
        return rejectWithValue(res.data.message || "Login failed");
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const performLogout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return;
});

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/api/auth/forgot-password", { email });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue("Something went wrong");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue("Something went wrong");
    }
  }
);
