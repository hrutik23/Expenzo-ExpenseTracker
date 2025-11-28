"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2", "#00C49F", "#FF8042"];

export default function CategorySpendingPie() {
  const { transactions = [] } = useSelector((state) => state.transactions);

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const data = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c] = 0));

    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (t.type === "Expense" && d.getMonth() === month && d.getFullYear() === year) {
        if (map[t.category] !== undefined) {
          map[t.category] += Number(t.amount);
        }
      }
    });

    return categories
      .map((cat) => ({ name: cat, value: map[cat] }))
      .filter((entry) => entry.value > 0);
  }, [transactions]);


  return (
    <div className="bg-white p-4 rounded shadow w-full h-[400px] md:h-[420px]">
      <h2 className="text-xl font-semibold">Expense by Category</h2>
      <ResponsiveContainer width="100%" height="95%" className="text-[10px] md:text-[14px]">
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={130}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

  );
}
