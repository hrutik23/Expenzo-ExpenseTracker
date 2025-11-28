import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async ({ month, year } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || localStorage.getItem("token");
      const params = {};
      if (month != null) params.month = month;
      if (year != null) params.year = year;

      const res = await apiClient.get("/api/budgets", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const setBudgetApi = createAsyncThunk(
  "budget/setBudget",
  async ({ category, amount, month, year }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || localStorage.getItem("token");
      const payload = { category, amount: Number(amount), month, year };
      const res = await apiClient.post("/api/budgets/set", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
