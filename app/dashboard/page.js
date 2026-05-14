"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getInvestorById,
  getNetWorth,
  getInvestorHoldings,
} from "../../lib/api";
import {
  TrendingUp,
  User,
  Phone,
  Mail,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

function StatCard({ label, value, icon: Icon, accent, description }) {
  return (
    <div className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:border-black/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${accent} bg-opacity-10 transition-colors group-hover:bg-opacity-100`}>
          <Icon size={20} className={`${accent.replace('bg-', 'text-')} group-hover:text-white transition-colors`} />
        </div>
        <ArrowUpRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [networth, setNetworth] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [profRes, nwRes, holdRes] = await Promise.all([
          getInvestorById(user.id),
          getNetWorth(user.id),
          getInvestorHoldings(user.id),
        ]);
        setProfile(profRes.data);
        setNetworth(nwRes.data);
        setHoldings(holdRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const fmt = (v) =>
    v != null
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(Number(v))
      : "—";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50/50">
        <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          Securing Workspace
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {error && (
        <div className="px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Executive Summary
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back, <span className="text-black font-bold">{profile?.name || user?.name}</span>. 
            Here is your portfolio status.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full" />
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Live</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Total Net Worth"
          value={fmt(networth?.netWorth)}
          icon={Wallet}
          accent="bg-black"
        />
        <StatCard
          label="Active Holdings"
          value={`${holdings.length} Assets`}
          icon={Layers}
          accent="bg-indigo-600"
        />
        <StatCard
          label="Top Allocation"
          value={
            holdings.length > 0
              ? holdings
                  .reduce((a, b) =>
                    Number(b.current_value) > Number(a.current_value) ? b : a,
                  )
                  .fund_name.split(" ")
                  .slice(0, 2)
                  .join(" ")
              : "No Data"
          }
          icon={TrendingUp}
          accent="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden mb-4">
                        <img
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${profile?.name || "User"}&backgroundColor=000000`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{profile?.name}</h3>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-1">Investor Account</p>
                </div>

                <div className="mt-8 space-y-4">
                    {[
                        { icon: Mail, label: "Email Address", value: profile?.email },
                        { icon: Phone, label: "Contact", value: profile?.contact_info || "Not Set" },
                        { icon: User, label: "Client ID", value: `0000${user?.id}`.slice(-4) },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <item.icon size={16} className="text-slate-400" />
                            <div className="overflow-hidden">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Portfolio Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Portfolio Composition
              </h3>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              {holdings.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {["Asset Class", "Quantity", "NAV (₹)", "Market Value"].map((h) => (
                        <th key={h} className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {holdings.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {h.fund_name}
                          </p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-600">
                              {Number(h.total_units).toFixed(3)}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-slate-500">
                          {fmt(h.current_nav)}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-black">
                            {fmt(h.current_value)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={24} className="text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    No active positions found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Start a SIP to see your portfolio grow.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}