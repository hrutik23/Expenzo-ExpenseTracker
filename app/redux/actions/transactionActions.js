import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../apiClient";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; 
      const res = await apiClient.get("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await apiClient.post("/api/transactions/add", transactionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
