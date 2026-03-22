/**
 * AuthContext.tsx — Contexto global de autenticação
 *
 * Centraliza o estado de sessão do usuário e expõe as ações de autenticação
 * para toda a árvore de componentes via React Context + hook `useAuth`.
 *
 * Estado gerenciado:
 *   user: AuthUser | null — objeto com { token, email } do usuário logado,
 *                           ou null quando não autenticado.
 *
 * Persistência:
 *   O token e o email são salvos no localStorage sob as chaves:
 *     - "odonto_token"       → JWT
 *     - "odonto_token_email" → email do usuário
 *
 *   Na inicialização, o estado é hidratado a partir do localStorage,
 *   permitindo que a sessão sobreviva a recarregamentos de página.
 *
 * Segurança:
 *   - O token nunca é exposto fora deste contexto e do authService.
 *   - O logout sempre limpa a sessão local, mesmo que a API falhe.
 *   - Nenhuma rota protegida deve ser acessível sem user !== null.
 *     (proteção de rota implementada no App.tsx via react-router-dom)
 *
 * Uso:
 *   const { user, isAuthenticated, setToken, logout } = useAuth();
 */
import React, { createContext, useContext, useState } from "react";
import type { AuthUser } from "@/types/auth";
import { logout as logoutService } from "@/services/authService";

const STORAGE_KEY = "odonto_token";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Persiste o token recebido após login e atualiza o estado. */
  setToken: (token: string, email: string) => void;
  /** Invalida o token na API e encerra a sessão local. Sempre resolve. */
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
      // Invalida o token no servidor. Em caso de falha (rede, token já expirado),
      // o erro é suprimido — a sessão local é encerrada de qualquer forma.
      await logoutService(user.token).catch(() => {});
    }
    clearSession();
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, setToken, logout }}>
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
