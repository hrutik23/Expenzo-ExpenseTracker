"use client";

import { useSelector, useDispatch } from "react-redux";
import { fetchBudgets, setBudgetApi } from "@/app/redux/actions/budgetActions";
import { useEffect, useMemo, useState } from "react";

export default function BudgetsPage() {
  const dispatch = useDispatch();
  const { budgetsByKey = {}, loading, error } = useSelector((state) => state.budget);
  const { transactions = [] } = useSelector((state) => state.transactions);

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const months = [
    "January","February","March","April","May","June","July",
    "August","September","October","November","December"
  ];

  const current = new Date();
  const [selectedMonth, setSelectedMonth] = useState(current.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(current.getFullYear());
  const key = `${selectedYear}-${selectedMonth}`;

  const [showModal, setShowModal] = useState(false);
  const existingBudgets = budgetsByKey[key] || {};

  const [tempBudgets, setTempBudgets] = useState(() => {
    const base = {};
    categories.forEach((c) => (base[c] = existingBudgets[c] ?? 0));
    return base;
  });

  useEffect(() => {
    setTempBudgets(() => {
      const base = {};
      categories.forEach((c) => (base[c] = (budgetsByKey[key] && budgetsByKey[key][c]) ?? 0));
      return base;
    });
  }, [budgetsByKey, key]);

  useEffect(() => {
    dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const monthlySpent = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c] = 0));
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (t.type === "Expense" && d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear) {
        if (map.hasOwnProperty(t.category)) map[t.category] += Number(t.amount);
      }
    });
    return map;
  }, [transactions, selectedMonth, selectedYear]);

  const totalBudget = categories.reduce((acc, c) => acc + (existingBudgets[c] ?? 0), 0);
  const totalSpent = categories.reduce((acc, c) => acc + (monthlySpent[c] ?? 0), 0);
  const totalLeft = totalBudget - totalSpent;

  const handleSaveBudgets = async () => {
    for (const cat of categories) {
      const amount = Number(tempBudgets[cat] ?? 0);
      await dispatch(
        setBudgetApi({ category: cat, amount, month: selectedMonth, year: selectedYear })
      ).unwrap();
    }
    await dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear })).unwrap();
    setShowModal(false);
  };

  return (
    <div className="mx-auto px-2 md:px-5 py-2">
      <div className="flex flex-col gap-2 md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Monthly Budgets</h2>

        <div className="flex flex-col md:flex-row gap-3">
          <select
            className="border border-gray-300 p-2 rounded bg-purple-300"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            className="border border-gray-300 p-2 rounded bg-purple-300"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
          >
            Set Budgets
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="rounded-xl overflow-hidden">
        {categories.map((cat) => {
          const spent = monthlySpent[cat] ?? 0;
          const limit = existingBudgets[cat] ?? 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const exceeded = spent > limit;
          const balance = limit - spent;

          return (
            <div key={cat} className="bg-white px-5 py-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">{cat}</h3>
                <p className={`font-semibold ${exceeded ? "text-red-600" : "text-gray-700"}`}>
                  {spent} / {limit} Rs
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded h-3 mb-1">
                <div
                  className={`h-3 rounded ${exceeded ? "bg-red-600" : "bg-green-500"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between text-gray-700">
                <p>{Math.round(percent)}% spent</p>
                <p>
                  {exceeded
                    ? `Exceeded by ${Math.abs(balance)} Rs`
                    : `${balance} Rs remaining`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <p className="text-gray-600">Total Budget</p>
            <p className="font-bold text-xl">{totalBudget} Rs</p>
          </div>

          <div className="bg-red-100 p-4 rounded shadow text-center">
            <p className="text-gray-600">Total Spent</p>
            <p className="font-bold text-xl">{totalSpent} Rs</p>
          </div>

          <div className={`p-4 rounded shadow text-center ${totalLeft < 0 ? "bg-red-100" : "bg-green-100"}`}>
            <p className="text-gray-600">Total Left</p>
            <p className="font-bold text-xl">{totalLeft} Rs</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Set Budgets for {months[selectedMonth - 1]} {selectedYear}
            </h3>

            <div className="space-y-3 max-h-72 overflow-auto">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center gap-3">
                  <label className="w-32">{cat}</label>
                  <input
                    type="number"
                    value={tempBudgets[cat] ?? 0}
                    onChange={(e) =>
                      setTempBudgets((s) => ({ ...s, [cat]: e.target.value }))
                    }
                    className="p-2 border rounded flex-1"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleSaveBudgets} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save Budgets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
