import { apiFetch } from "@/core/api";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logout(token: string): Promise<void> {
  return apiFetch<void>("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
