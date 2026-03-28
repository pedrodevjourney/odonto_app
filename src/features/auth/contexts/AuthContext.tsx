import React, { createContext, useContext, useState } from "react";
import type { AuthUser } from "@/features/auth/types/auth";
import { logout as logoutService } from "@/features/auth/services/authService";

const STORAGE_KEY = "odonto_token";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string, email: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    const email = localStorage.getItem(`${STORAGE_KEY}_email`);
    if (token && email) return { token, email };
    return null;
  });

  function setToken(token: string, email: string) {
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(`${STORAGE_KEY}_email`, email);
    setUser({ token, email });
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_email`);
    setUser(null);
  }

  async function logout() {
    if (user?.token) {
      await logoutService(user.token).catch(() => {});
    }
    clearSession();
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
