"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, addTransaction } from "../redux/actions/transactionActions";
import { fetchBudgets } from "../redux/actions/budgetActions";

import ExpenseAnalyticsCard from "../components/ExpenseAnalyticsCard";
import CategoryBudgetBars from "../components/CategoryBudgetBars";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.transactions);
  const { budgetsByKey = {}, loading: budgetLoading } = useSelector((state) => state.budget);

  const incomeCategories = ["Salary", "Investment", "Bonus", "Other"];
  const expenseCategories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const [formData, setFormData] = useState({
    type: "Expense",
    category: expenseCategories[0],
    amount: "",
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    notes: "",
  });

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets({ month: currentMonth, year: currentYear }));
  }, [dispatch, currentMonth, currentYear]);

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      category: type === "Income" ? incomeCategories[0] : expenseCategories[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransaction(formData));
    setFormData({
      ...formData,
      amount: "",
      merchant: "",
      notes: "",
      category: formData.type === "Income" ? incomeCategories[0] : expenseCategories[0],
    });
  };

  const categories = formData.type === "Income" ? incomeCategories : expenseCategories;

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  const monthlyMap = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
    if (t.type === "Income") monthlyMap[key].income += Number(t.amount);
    else monthlyMap[key].expense += Number(t.amount);
  });

  const chartData = Object.keys(monthlyMap).map((m) => ({
    label: m,
    income: monthlyMap[m].income,
    expense: monthlyMap[m].expense,
  }));

  const router = useRouter();
  const handleClick = () => {
    router.push('/dashboard/transactions');
  };

  return (
    <div className="mx-auto p-2 md:px-8 ">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-10 rounded shadow text-center">
          <p className="">Total Balance</p>
          <p className="font-bold text-xl ">{totalBalance} Rs</p>
        </div>
        <div className="bg-white p-10 rounded shadow text-center">
          <p className="">Total Income</p>
          <p className="font-bold text-xl text-green-600">{totalIncome} Rs</p>
        </div>
        <div className="bg-white p-10 rounded shadow text-center">
          <p className="">Total Expense</p>
          <p className="font-bold text-xl text-red-600">{totalExpense} Rs</p>
        </div>
        <div className="bg-white p-10 rounded shadow text-center">
          <p className="">Total Savings</p>
          <p className="font-bold text-xl text-purple-400">{totalBalance} Rs</p>
        </div>
      </div>

      <div className="space-y-8 mb-10">
        <ExpenseAnalyticsCard data={chartData} />

        <div>
          {budgetLoading ? (
            <p className="text-gray-500 p-4">Loading budget data...</p>
          ) : (
            <CategoryBudgetBars />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md max-full mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1">Merchant</label>
              <input
                value={formData.merchant}
                placeholder="Merchant Name"
                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Notes</label>
              <input
                value={formData.notes}
                placeholder="Add notes"
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 cursor-pointer">Add Transaction</button>
        </form>
      </div>

      <div className="mb-8 shadow-md rounded-md bg-white">
        <div className="flex justify-between px-4 pt-4">
          <h3 className="text-xl font-semibold mb-3">Recent Transactions</h3>

          <button onClick={handleClick} className="border border-gray-400 px-3 font-semibold rounded-sm text-black text-[14px] cursor-pointer">View All</button>

        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-2">
          {transactions
            .slice()
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);

              if (dateB - dateA !== 0) return dateB - dateA; 
              return b.id - a.id; 
            })
            .slice(0, 5)
            .map((t) => (
              <div
                key={t.id}
                className="flex justify-between p-4 border-b border-gray-300 last:border-none"
              >
                <div>
                  <p className="font-semibold">{t.merchant || "-"}</p>
                  <p className="text-gray-500 text-sm">{t.notes || "-"}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "Income" ? `+ ${t.amount}` : `- ${t.amount}`} Rs
                  </p>
                  <p className="text-gray-500 text-sm">{t.date}</p>
                </div>
              </div>
            ))}
          {transactions.length === 0 && !loading && (
            <p className="text-center py-4 text-gray-500">No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
