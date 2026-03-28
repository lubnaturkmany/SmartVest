import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { authStorage } from "../lib/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient
      .get("/api/auth/me")
      .then((res) => setUser(res))
      .catch(() => authStorage.clearToken())
      .finally(() => setLoading(false));
  }, []);
  
  
const login = async (email, password) => {
  const data = await apiClient.post("/api/auth/login", { email, password });

  // إذا السيرفر رجع tempToken => المستخدم لازم يغير الباسورد
if (data.tempToken) {
  localStorage.setItem("sv_temp_token", data.tempToken); 
  return { mustChangePassword: true, token: data.tempToken };
}

  // تسجيل دخول طبيعي
  authStorage.setToken(data.token);
  const current = await apiClient.get("/api/auth/me");
  setUser(current);

  return { mustChangePassword: false, token: data.token };
};

  const logout = () => {
    authStorage.clearToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, setUser }), [user, loading]);
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
