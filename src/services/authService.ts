/**
 * authService.ts — Serviço de autenticação
 *
 * Camada de acesso aos endpoints de autenticação da API REST (Spring Boot).
 * Não mantém estado — toda gestão de sessão é responsabilidade do AuthContext.
 *
 * Endpoints cobertos:
 *   POST /auth/login   → autentica credenciais e retorna o JWT
 *   POST /auth/logout  → invalida o token no servidor (blacklist)
 *
 * Fluxo completo de autenticação:
 *
 *  1. LOGIN
 *     ┌─────────────┐   credentials    ┌──────────────┐   JWT token   ┌──────────────┐
 *     │  LoginForm  │ ───────────────► │ authService  │ ────────────► │ AuthContext  │
 *     │             │                  │  .login()    │               │  .setToken() │
 *     └─────────────┘                  └──────────────┘               └──────┬───────┘
 *                                                                             │
 *                                                                    salva em localStorage
 *                                                                    redireciona → /dashboard
 *
 *  2. SESSÃO PERSISTIDA
 *     Na inicialização do app, AuthContext lê o token do localStorage.
 *     Se presente, o usuário é considerado autenticado sem nova chamada à API.
 *     O token deve ser enviado no header Authorization de todas as rotas protegidas.
 *
 *  3. LOGOUT
 *     ┌────────────┐  handleLogout  ┌──────────────┐  POST /auth/logout  ┌─────────┐
 *     │  UserMenu  │ ─────────────► │ AuthContext  │ ───────────────────► │   API   │
 *     │            │                │  .logout()   │  Authorization: JWT  │         │
 *     └────────────┘                └──────┬───────┘                      └─────────┘
 *                                          │
 *                                   limpa localStorage
 *                                   zera estado (user = null)
 *                                   redireciona → /login
 *
 *     Garantia de segurança: mesmo que a chamada à API falhe (rede, token já
 *     expirado), a sessão local é encerrada — o usuário nunca fica preso.
 */
import { apiFetch } from "./api";
import type { LoginRequest, LoginResponse } from "@/types/auth";

/**
 * Autentica o usuário com email e senha.
 *
 * @returns LoginResponse contendo o JWT gerado pelo servidor.
 * @throws  Error se as credenciais forem inválidas (401) ou ocorrer falha de rede.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * Invalida o token JWT no servidor (blacklist).
 *
 * O token é enviado no header Authorization como Bearer.
 * A resposta esperada é 204 No Content.
 *
 * @param token JWT ativo do usuário autenticado.
 */
export async function logout(token: string): Promise<void> {
  return apiFetch<void>("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
