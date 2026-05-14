"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginInvestor } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const { data } = await loginInvestor(form);
        
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;

        login(data.token, data.user);

        router.replace("/dashboard");
    } catch (err) {
        setError(err.response?.data?.error || "Login failed");
    } finally {
        setLoading(false);
    }
};

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* ── Left black panel ── */}
      <div
        style={{
          width: "45%",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          boxSizing: "border-box",
        }}
        className="hidden-mobile"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: "#fff",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={18} color="#000" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>KFintech</span>
        </div>

        {/* Middle content */}
        <div>
          {/* Stat cards — inline flex row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Total AUM", value: "₹2.4Cr" },
              { label: "Active SIPs", value: "1,284" },
              { label: "Avg. Returns", value: "14.2%" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "14px 16px",
                }}
              >
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginBottom: 6 }}>
                  {s.label}
                </div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: 36,
              fontWeight: 900,
              lineHeight: 1.2,
              margin: "0 0 16px 0",
            }}
          >
            Grow your wealth,
            <br />
            <span style={{ color: "#facc15" }}>systematically.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7, maxWidth: 340, margin: 0 }}>
            Manage your mutual fund investments, track SIPs, and monitor your portfolio performance — all in one place.
          </p>
        </div>

        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>
          © 2025 KFintech. All rights reserved.
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#000",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17 }}>KFintech</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#000", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 32px 0" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#000", fontWeight: 600, textDecoration: "underline" }}>
              Register
            </Link>
          </p>

          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                color: "#dc2626",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 14,
                  color: "#000",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "13px 44px 13px 16px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    fontSize: 14,
                    color: "#000",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#6b7280" : "#000",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 12,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
