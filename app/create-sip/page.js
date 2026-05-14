"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getFunds,
  createSIP,
  processSIP,
  getSipsByInvestor,
} from "../../lib/api";
import { CheckCircle2, RefreshCw, Zap, TrendingUp, AlertCircle } from "lucide-react";

function Badge({ status }) {
  const colors = {
    ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    PAUSED: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status || "ACTIVE"}
    </span>
  );
}

export default function CreateSIPPage() {
  const { user } = useAuth();
  const [funds, setFunds] = useState([]);
  const [form, setForm] = useState({ fund_id: "", amount: "", execution_date: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [userSips, setUserSips] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setListLoading(true);
    try {
      const [fundsRes, sipsRes] = await Promise.all([
        getFunds().catch(() => ({ data: [] })),
        getSipsByInvestor(user.id).catch(() => ({ data: [] }))
      ]);
      setFunds(fundsRes.data || []);
      setUserSips(sipsRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setListLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setCreateError("Session expired. Please log in again.");
      return;
    }
    setCreateError("");
    setCreateSuccess("");
    setCreateLoading(true);

    try {
      
      const payload = {
        investorId: user.id,
        fundId: Number(form.fund_id),
        amount: Number(form.amount),
        executionDate: Number(form.execution_date),
      };

      await createSIP(payload);
      
      setCreateSuccess("SIP mandate created successfully!");
      setForm({ fund_id: "", amount: "", execution_date: "" });
      fetchData(); 
    } catch (err) {
      setCreateError(err.response?.data?.error || "Failed to create SIP.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleProcess = async (sipId) => {
    setProcessingId(sipId);
    try {
      const { data } = await processSIP(sipId);
     
      alert(`Success! Units Allocated: ${Number(data.data?.units).toFixed(4)}`);
      fetchData(); 
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Failed to process."}`);
    } finally {
      setProcessingId(null);
    }
  };

  const fmt = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-black rounded-2xl text-white shadow-lg"><TrendingUp size={24} /></div>
        <div>
          <h1 className="text-2xl font-black text-black">SIP Portfolio</h1>
          <p className="text-gray-500 text-sm">Automated wealth building engine.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-black text-black text-lg">Setup New Mandate</h2>
        </div>
        <div className="p-6">
          {createError && <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium"><AlertCircle size={16} />{createError}</div>}
          {createSuccess && <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium"><CheckCircle2 size={16} />{createSuccess}</div>}

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Funds</label>
              <select name="fund_id" value={form.fund_id} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-all">
                <option value="">{funds.length === 0 ? "Loading..." : "-- Select Scheme --"}</option>
                {funds.map((f) => (
                  <option key={f.fund_id} value={f.fund_id}>{f.fund_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Amount</label>
              <input name="amount" type="number" min="500" value={form.amount} onChange={handleChange} placeholder="5000" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cycle Date (1-28)</label>
              <input name="execution_date" type="number" min="1" max="28" value={form.execution_date} onChange={handleChange} placeholder="10" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black" />
            </div>
            <div className="md:col-span-3">
                <button type="submit" disabled={createLoading || funds.length === 0} className="w-full md:w-auto px-10 py-3.5 bg-black text-white font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40">
                    {createLoading ? "Creating..." : "Activate Systematic Plan"}
                </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-black text-black text-lg">Active Investment Plans</h2>
          <button onClick={fetchData} className="p-2.5 hover:bg-white rounded-xl transition-all">
            <RefreshCw size={18} className={listLoading ? "animate-spin text-gray-400" : "text-black"} />
          </button>
        </div>
        <div className="p-6">
          {userSips.length === 0 ? (
            <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No active plans found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userSips.map((sip) => (
                <div key={sip.sip_id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-black/10 transition-all">
                  <div className="bg-gray-50/80 px-5 py-2.5 flex items-center justify-between border-b border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mandate #{sip.sip_id}</span>
                    <Badge status={sip.status || "ACTIVE"} />
                  </div>
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-16">
                      <div className="min-w-[120px]">
                        <div className="text-[9px] text-gray-400 uppercase font-black mb-1.5">Amount</div>
                        <div className="text-2xl font-black text-black">{fmt(sip.amount)}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase font-black mb-1.5">Cycle Date</div>
                        <div className="text-2xl font-black text-black">{sip.execution_date}th</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase font-black mb-1.5">Fund</div>
                        <div className="text-sm font-bold text-gray-700">{sip.fund_name}</div>
                      </div>
                    </div>
                    <button 
                        onClick={() => handleProcess(sip.sip_id)} 
                        disabled={processingId === sip.sip_id || (sip.status && sip.status !== "ACTIVE")} 
                        className="flex items-center gap-2.5 px-8 py-3.5 bg-black text-white font-black rounded-2xl text-[12px] uppercase tracking-wider hover:bg-gray-900 transition-all disabled:opacity-30"
                    >
                      {processingId === sip.sip_id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Zap size={14} className="fill-current" />
                      )} 
                      Trigger Installment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}