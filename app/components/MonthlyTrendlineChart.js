"use client";

import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSelector } from "react-redux";

export default function MonthlyTrendLineChart() {
  const { transactions = [] } = useSelector((state) => state.transactions);

  const year = new Date().getFullYear();

  const data = useMemo(() => {
    const monthly = {};

    for (let i = 1; i <= 12; i++) {
      monthly[i] = { month: i, income: 0, expense: 0 };
    }

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();

      if (y === year) {
        if (t.type === "Income") monthly[m].income += Number(t.amount);
        if (t.type === "Expense") monthly[m].expense += Number(t.amount);
      }
    });

    return Object.values(monthly).map((m) => ({
      ...m,
      month: new Date(2024, m.month - 1).toLocaleString("en", { month: "short" }),
    }));
  }, [transactions]);

  return (
    <div className="bg-white p-3 rounded shadow w-full h-[400px] md:h-[420px] ">
      <h2 className="text-xl font-semibold">Income vs Expense Trend</h2>
      <ResponsiveContainer width="100%" height="100%" className="py-5" >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="income" stroke="green" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="red" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
