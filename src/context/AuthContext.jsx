import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

const getCookieToken = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("chater_token="));

  if (!match) return null;
  const value = decodeURIComponent(match.split("=")[1] || "");
  return value || null;
};

const getStoredToken = () => {
  const cookieToken = getCookieToken();
  if (cookieToken) return cookieToken;
  return localStorage.getItem("chater_token");
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      localStorage.removeItem("chater_token");
      document.cookie =
        "chater_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; sameSite=Lax";
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (newToken) => {
    if (!newToken) return;
    localStorage.setItem("chater_token", newToken);
    document.cookie = `chater_token=${encodeURIComponent(newToken)}; path=/; max-age=${30 * 24 * 60 * 60}; sameSite=Lax`;
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("chater_token");
    document.cookie =
      "chater_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; sameSite=Lax";
    setToken(null);
    setUser(null);
  };

  const role = (user?.role || "").toUpperCase();
  const isStaff = role === "ADMIN" || role === "MANAGER";
  const isAdmin = role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isStaff,
        isAdmin,
        login,
        logout,
        refresh: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
