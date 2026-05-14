"use client";

import { Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { logoutInvestor } from "../../lib/api";

export default function DashHeader({ title }) {
  const [toggle, setToggle] = useState("Full Statistics");
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-row items-center justify-between w-full p-3 bg-transparent">
      {/* Left Side: Title and Pill Toggle */}
      <div className="flex items-center space-x-8">
        <h1 className="text-3xl font-black text-black tracking-tight">{title}</h1>

        {/* Pill Toggle Container */}
        <div className="flex bg-gray-200/50 p-1 rounded-full items-center">
          <button
            onClick={() => setToggle("Full Statistics")}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
              toggle === "Full Statistics"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400"
            }`}
          >
            Full Statistics
          </button>
          <button
            onClick={() => setToggle("Results Summary")}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
              toggle === "Results Summary"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400"
            }`}
          >
            Results Summary
          </button>
        </div>
      </div>

      {/* Right Side: Plus Button, user name, Avatar */}
      <div className="flex items-center space-x-4">

        <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
          <Plus size={20} className="text-black" />
        </button>

            {user && (
          <span className="text-sm font-semibold text-gray-600 hidden sm:block">
            {user.name}
          </span>
        )}

        <div className="w-12 h-12 rounded-full bg-indigo-400 border-2 border-white overflow-hidden shadow-sm">
          <img
            src={`https://api.dicebear.com/9.x/toon-head/svg?seed=${user?.name || "default"}`}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
