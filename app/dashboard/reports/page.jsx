"use client";

import { useSelector } from "react-redux";
import ExpenseAnalyticsCard from "@/app/components/ExpenseAnalyticsCard";
import CategorySpendingPie from "@/app/components/CategorySpendingPie";
import MonthlyTrendLineChart from "@/app/components/MonthlyTrendlineChart";

export default function ReportsPage() {
  const { transactions = [] } = useSelector((state) => state.transactions);

  const monthlyMap = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = { income: 0, expense: 0 };
    }

    if (t.type === "Income") {
      monthlyMap[key].income += Number(t.amount);
    } else if (t.type === "Expense") {
      monthlyMap[key].expense += Number(t.amount);
    }
  });

  const chartData = Object.keys(monthlyMap).map((m) => ({
    label: m,
    income: monthlyMap[m].income,
    expense: monthlyMap[m].expense,
  }));

  return (
    <div className="mx-auto lg:px-6 pb-4">
      <h2 className="text-3xl font-bold mb-6">Reports</h2>

      <ExpenseAnalyticsCard data={chartData} />

      <div className="flex flex-col lg:flex-row gap-4 mt-8">
        <CategorySpendingPie />
        <MonthlyTrendLineChart />
      </div>
    </div>
  );
}
