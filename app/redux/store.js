import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import transactionsReducer from "./slices/transactionSlice"
import budgetReducer from "./slices/budgetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer, 
    budget : budgetReducer,
  },
});

export default store;
