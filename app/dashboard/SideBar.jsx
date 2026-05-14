"use client";

import {
  LayoutDashboard,
  BadgeDollarSign,
  PersonStanding,
  Notebook,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { logoutInvestor } from "../../lib/api";

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={20} />, title: "Dashboard", href: "/dashboard" },
  { icon: <BadgeDollarSign size={20} />, title: "Investments", href: "/investments" },
  { icon: <PersonStanding size={20} />, title: "Create SIP", href: "/create-sip" },
  { icon: <Notebook size={20} />, title: "View Transactions", href: "/view-transactions" },
];

export default function SideBar({ active, setActive }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNav = (item) => {
    setActive(item.title);
    router.push(item.href);
  };

  const handleLogout = async () => {
    try { await logoutInvestor(); } catch (_) {}
    logout();
  };

  return (
    <div className="w-[300px] h-full bg-white flex flex-col p-6 py-5 border-r border-gray-100">
      <div className="font-bold text-2xl mt-4 mb-8 px-2">KFintech</div>

      {/* Upper Menu Items */}
      <div className="flex flex-col space-y-1">
        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 px-2">
          Main Menu
        </div>
        {NAV_ITEMS.map((item) => (
          <HeaderItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            active={active}
            onClick={() => handleNav(item)}
          />
        ))}
      </div>

      
      <div className="mt-auto flex flex-col space-y-1">
        <HeaderItem
          icon={<Settings size={20} />}
          title="Settings"
          active={active}
          onClick={() => setActive("Settings")}
        />
        <HeaderItem
          icon={<LogOut size={20} />}
          title="Log Out"
          active={active}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}

function HeaderItem({ icon, title, active, onClick }) {
  const isActive = active === title;

  return (
    <div
      onClick={onClick}
      className={`flex flex-row items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-gray-100 text-black font-bold shadow-sm"
            : "text-gray-400 font-medium hover:bg-gray-50 hover:text-black"
        }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="text-sm">{title}</div>
    </div>
  );
}
