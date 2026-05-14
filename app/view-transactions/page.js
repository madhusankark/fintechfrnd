"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTransactions, getInvestorHoldings } from "../../lib/api";
import { RefreshCw, ReceiptText, Layers } from "lucide-react";

const TABS = ["Transactions", "Holdings"];

export default function ViewTransactionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Transactions");
  const [transactions, setTransactions] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const [txRes, holdRes] = await Promise.all([
        getTransactions(user.id),
        getInvestorHoldings(user.id),
      ]);
      setTransactions(txRes.data);
      setHoldings(holdRes.data);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const fmt = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(v));

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-black tracking-tight">Activity</h2>
          <p className="text-gray-400 text-sm mt-0.5">Your investment history & portfolio</p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={16} className="text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-black text-white shadow-sm"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {tab === "Transactions" ? (
              <ReceiptText size={14} />
            ) : (
              <Layers size={14} />
            )}
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Transactions Tab */}
          {activeTab === "Transactions" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-10 text-center">
                  <ReceiptText size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No transactions yet. Process a SIP installment to get started.</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {transactions.length} Transaction{transactions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          {["#", "Fund", "Units", "NAV at Buy", "Amount Paid", "Date"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr
                            key={tx.id}
                            className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-xs text-gray-400 font-bold">#{tx.id}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-black">{tx.fund_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {Number(tx.units_allotted).toFixed(4)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {fmt(tx.nav_at_transaction)}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-black">
                              {fmt(tx.amount_paid)}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-400">
                              {fmtDate(tx.transaction_date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Holdings Tab */}
          {activeTab === "Holdings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {holdings.length === 0 ? (
                <div className="p-10 text-center">
                  <Layers size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No holdings found. Start investing via SIP!</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {holdings.length} Fund{holdings.length !== 1 ? "s" : ""} held
                    </span>
                  </div>

                  {/* Summary row */}
                  <div className="px-6 py-4 bg-black flex items-center justify-between">
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                      Total Portfolio Value
                    </span>
                    <span className="text-white font-black text-xl">
                      {fmt(
                        holdings.reduce(
                          (sum, h) => sum + Number(h.current_value),
                          0
                        )
                      )}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          {["Fund", "Total Units", "Current NAV", "Current Value"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((h, i) => (
                          <tr
                            key={i}
                            className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-black">{h.fund_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {Number(h.total_units).toFixed(4)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{fmt(h.current_nav)}</td>
                            <td className="px-6 py-4 text-sm font-black text-black">
                              {fmt(h.current_value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
