"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../redux/actions/transactionActions";
import Link from "next/link";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { transactions = [], loading, error } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="mx-auto px-2 md:px-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">All Transactions</h2>

        {/* <Link
          href="/dashboard"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          + Add Transaction
        </Link> */}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded shadow-lg border border-gray-300 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b border-gray-300">Date</th>
              <th className="p-3 border-b border-gray-300">Description</th>
              <th className="p-3 border-b border-gray-300">Category</th>
              <th className="p-3 border-b border-gray-300">Merchant</th>
              <th className="p-3 border-b border-gray-300">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 &&
              transactions
                .slice()
                .sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);

                  if (dateB - dateA !== 0) return dateB - dateA; 
                  return b.id - a.id; 
                })
                

                .map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 border-b last:border-none">
                    <td className="p-3">{t.date}</td>
                    <td className="p-3">{t.notes || "-"}</td>
                    <td className="p-3">{t.category}</td>
                    <td className="p-3">{t.merchant || "-"}</td>
                    <td
                      className={`p-3 font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {t.type === "Income" ? `+ ${t.amount} Rs` : `- ${t.amount} Rs`}
                    </td>
                  </tr>
                ))}

            {!loading && transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
