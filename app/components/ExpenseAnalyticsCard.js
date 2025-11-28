"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ExpenseAnalyticsCard = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h3 className="text-2xl font-bold mb-4">Expense Analytics</h3>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            <Bar dataKey="income" fill="#22c55e" name="Income" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseAnalyticsCard;
