"use client";

import { useState, useEffect } from "react";
import { getFunds, addFund, updateFundNav } from "../../lib/api";
import { Plus, X, RefreshCw, TrendingUp, Edit2 } from "lucide-react";

// Reusable Modal Component
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-black text-black text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Reusable Input Component
function InputField({ label, name, type = "text", value, onChange, placeholder, step }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        required
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
      />
    </div>
  );
}

export default function InvestmentsPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Fund Modal State
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ fund_name: "", amc_name: "", current_nav: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Update NAV Modal State
  const [navTarget, setNavTarget] = useState(null); 
  const [newNav, setNewNav] = useState("");
  const [navLoading, setNavLoading] = useState(false);
  const [navError, setNavError] = useState("");

  const fetchFunds = async () => {
    setLoading(true);
    try {
      const { data } = await getFunds();
      setFunds(data);
    } catch (err) {
      setError("Failed to load funds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFunds(); }, []);

  const handleAddChange = (e) =>
    setAddForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAddFund = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      await addFund({
        ...addForm,
        current_nav: Number(addForm.current_nav),
      });
      setShowAdd(false);
      setAddForm({ fund_name: "", amc_name: "", current_nav: "" });
      fetchFunds();
    } catch (err) {
      setAddError(err.response?.data?.error || "Failed to add fund.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateNav = async (e) => {
    e.preventDefault();
    if (!navTarget) return;
    
    setNavLoading(true);
    setNavError("");
    try {
      // Using fund_id here as per your DB schema
      await updateFundNav(navTarget.fund_id, Number(newNav));
      setNavTarget(null);
      setNewNav("");
      fetchFunds();
    } catch (err) {
      setNavError(err.response?.data?.error || "Failed to update NAV.");
    } finally {
      setNavLoading(false);
    }
  };

  const fmt = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(v));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-black tracking-tight">All Funds</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {funds.length} fund{funds.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchFunds}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-gray-400" : "text-gray-500"} />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Fund
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : funds.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
          <TrendingUp size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No funds found</p>
          <button onClick={() => setShowAdd(true)} className="mt-4 text-sm font-black text-indigo-500">Create the first one →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {funds.map((fund) => (
            <div
              key={fund.fund_id} // FIXED: Using fund_id as unique key
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="font-black text-black text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                    {fund.fund_name}
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {fund.amc_name}
                  </div>
                </div>
                <button
                  onClick={() => { 
                    setNavTarget(fund); 
                    setNewNav(fund.current_nav); 
                  }}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-black hover:text-white transition-all text-gray-400"
                >
                  <Edit2 size={14} />
                </button>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">
                    Current NAV
                  </div>
                  <div className="text-2xl font-black text-black">
                    {fmt(fund.current_nav)}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-lg">
                  ID: #{fund.fund_id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Fund Modal */}
      {showAdd && (
        <Modal title="New Mutual Fund" onClose={() => { setShowAdd(false); setAddError(""); }}>
          <form onSubmit={handleAddFund} className="space-y-5">
            {addError && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
                {addError}
              </div>
            )}
            <InputField
              label="Fund Name"
              name="fund_name"
              value={addForm.fund_name}
              onChange={handleAddChange}
              placeholder="e.g. Parag Parikh Flexi Cap"
            />
            <InputField
              label="AMC (Company)"
              name="amc_name"
              value={addForm.amc_name}
              onChange={handleAddChange}
              placeholder="e.g. PPFAS Mutual Fund"
            />
            <InputField
              label="Initial NAV (₹)"
              name="current_nav"
              type="number"
              step="0.0001"
              value={addForm.current_nav}
              onChange={handleAddChange}
              placeholder="54.21"
            />
            <button
              type="submit"
              disabled={addLoading}
              className="w-full py-4 bg-black text-white font-black rounded-2xl text-sm hover:bg-gray-800 transition-all disabled:opacity-30"
            >
              {addLoading ? "Saving Fund..." : "Create Fund"}
            </button>
          </form>
        </Modal>
      )}

      {/* Update NAV Modal */}
      {navTarget && (
        <Modal
          title="Update Market Price"
          onClose={() => { setNavTarget(null); setNavError(""); }}
        >
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fund</p>
            <p className="text-sm font-black text-black">{navTarget.fund_name}</p>
          </div>
          <form onSubmit={handleUpdateNav} className="space-y-5">
            {navError && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
                {navError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                New NAV Value (₹)
              </label>
              <input
                type="number"
                step="0.0001"
                value={newNav}
                onChange={(e) => setNewNav(e.target.value)}
                autoFocus
                required
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-black text-black focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNavTarget(null)}
                className="py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={navLoading}
                className="py-4 bg-black text-white font-black rounded-2xl text-sm hover:bg-gray-800 disabled:opacity-30"
              >
                {navLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}