import { apiFetch } from "@/core/api";
import type { DashboardResponse } from "../types/dashboard";

export async function buscarDashboard(
  token: string,
): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>("/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
