"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function CategoryBudgetBars() {
  const { budgetsByKey = {} } = useSelector((state) => state.budget);
  const { transactions = [] } = useSelector((state) => state.transactions);

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const today = new Date();
  const selectedMonth = today.getMonth() + 1;
  const selectedYear = today.getFullYear();
  const key = `${selectedYear}-${selectedMonth}`;

  const existingBudgets = budgetsByKey[key] || {};
  const budgetsToUse = {};
  categories.forEach((c) => {
    budgetsToUse[c] = existingBudgets[c] ?? 0;
  });

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

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow">
      <h3 className="text-2xl font-semibold px-4 py-6">Budget Overview</h3>
      {categories.map((cat) => {
        const spent = monthlySpent[cat] ?? 0;
        const limit = budgetsToUse[cat] ?? 0;
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const exceeded = spent > limit;
        const balance = limit - spent;

        return (
          <div key={cat} className="px-5 py-4 border-b border-gray-300 last:border-b-0">
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
              <p>{limit === 0 ? "No budget set" : exceeded ? `Exceeded by ${Math.abs(balance)} Rs` : `${balance} Rs remaining`}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
