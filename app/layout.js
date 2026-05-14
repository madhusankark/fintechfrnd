"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import SideBar from "./dashboard/SideBar";
import DashHeader from "./dashboard/DashHeader";
import { AuthProvider, useAuth } from "../context/AuthContext";

const PUBLIC_PATHS = ["/login", "/register"];

function Shell({ children }) {
  const { user, token, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  const routeTitleMap = {
    "/dashboard": "Dashboard",
    "/investments": "Investments",
    "/create-sip": "Create SIP",
    "/view-transactions": "View Transactions",
  };
  const [active, setActive] = useState(
    routeTitleMap[pathname] || "Dashboard"
  );

  useEffect(() => {
    if (!loading && !token && !isPublic) {
      router.replace("/login");
    }
    if (!loading && token && isPublic) {
      router.replace("/dashboard");
    }
  }, [loading, token, isPublic, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPublic) return <>{children}</>;

  if (!token) return null;

  return (
    <div className="flex h-screen w-full bg-white">
      <SideBar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashHeader title={active} />
        <main className="flex-1 overflow-auto" style={{ backgroundColor: "#f8f8f6" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased m-0 p-0" style={{ overflow: "hidden", backgroundColor: "#fff" }}>
        <AuthProvider>
          <Shell>{children}</Shell>
        </AuthProvider>
      </body>
    </html>
  );
}
