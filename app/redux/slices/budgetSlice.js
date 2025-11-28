import { createSlice } from "@reduxjs/toolkit";
import { fetchBudgets, setBudgetApi } from "../actions/budgetActions";

const initialState = {
  budgetsByKey: {}, 
  budgetsList: [],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    clearBudgetError(state) {
      state.error = null;
    },
    clearBudgets(state) {
      state.budgetsByKey = {};
      state.budgetsList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;

        const userId = action.meta.arg?.userId; 
        const filteredBudgets = userId
          ? (action.payload || []).filter((b) => b.user?.id === userId)
          : action.payload || [];

        state.budgetsList = filteredBudgets;

        const map = {};
        filteredBudgets.forEach((b) => {
          const key = `${b.year}-${b.month}`;
          if (!map[key]) map[key] = {};
          map[key][b.category] = b.amount;
        });
        state.budgetsByKey = map; 
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    builder
      .addCase(setBudgetApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setBudgetApi.fulfilled, (state, action) => {
        state.loading = false;
        const b = action.payload;

        const idx = state.budgetsList.findIndex(
          (x) =>
            x.category === b.category &&
            x.month === b.month &&
            x.year === b.year &&
            x.user?.id === b.user?.id
        );
        if (idx !== -1) state.budgetsList[idx] = b;
        else state.budgetsList.push(b);

        const key = `${b.year}-${b.month}`;
        if (!state.budgetsByKey[key]) state.budgetsByKey[key] = {};
        state.budgetsByKey[key][b.category] = b.amount;
      })
      .addCase(setBudgetApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearBudgetError, clearBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
