"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerInvestor } from "../../lib/api";
import { TrendingUp, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  fontSize: 14,
  color: "#000",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 8,
};

const FEATURES = [
  "Create a free investor account",
  "Start SIPs with any amount",
  "Track your portfolio in real-time",
  "Manage multiple mutual funds",
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerInvestor(form);
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle2 size={52} color="#22c55e" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#000", margin: "0 0 8px 0" }}>Account Created!</h2>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Redirecting you to login…</p>
        </div>
      </div>
    );
  }

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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, backgroundColor: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={18} color="#000" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>KFintech</span>
        </div>

        {/* Middle */}
        <div>
          <div style={{ marginBottom: 28 }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#facc15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle2 size={12} color="#000" />
                </div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
          <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 900, lineHeight: 1.2, margin: "0 0 16px 0" }}>
            Your investment
            <br />
            <span style={{ color: "#facc15" }}>journey starts here.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7, maxWidth: 340, margin: 0 }}>
            Join thousands of investors who trust KFintech to grow their wealth through disciplined SIP investing.
          </p>
        </div>

        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>© 2025 KFintech. All rights reserved.</div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", backgroundColor: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, backgroundColor: "#000", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={14} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17 }}>KFintech</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#000", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Create account
          </h1>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 28px 0" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#000", fontWeight: 600, textDecoration: "underline" }}>
              Sign in
            </Link>
          </p>

          {error && (
            <div style={{ marginBottom: 20, padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Full Name</label>
              <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Karthik Reddy" style={inputStyle} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email Address</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Phone Number</label>
              <input name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="9876543210" style={inputStyle} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex", alignItems: "center" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", backgroundColor: loading ? "#6b7280" : "#000", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Creating account…
                </>
              ) : (
                "Create Account"
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
