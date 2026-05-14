"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
};

const eraseCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getCookie("kf_token");
    const storedUser = getCookie("kf_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Session recovery failed", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setCookie("kf_token", newToken);
    setCookie("kf_user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    eraseCookie("kf_token");
    eraseCookie("kf_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);