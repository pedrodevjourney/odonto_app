import { apiFetch } from "@/core/api";
import type {
  LancamentoResponse,
  LancamentoRequest,
  LancamentoUpdateRequest,
  ResumoFinanceiroResponse,
  FiltrosLancamento,
} from "@/features/financeiro/types/lancamento";

export async function criarLancamento(
  token: string,
  data: LancamentoRequest,
): Promise<LancamentoResponse> {
  return apiFetch<LancamentoResponse>("/lancamentos", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function buscarLancamento(
  token: string,
  id: number,
): Promise<LancamentoResponse> {
  return apiFetch<LancamentoResponse>(`/lancamentos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function atualizarLancamento(
  token: string,
  id: number,
  data: LancamentoUpdateRequest,
): Promise<LancamentoResponse> {
  return apiFetch<LancamentoResponse>(`/lancamentos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function excluirLancamento(
  token: string,
  id: number,
): Promise<void> {
  return apiFetch<void>(`/lancamentos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listarLancamentosPorPaciente(
  token: string,
  pacienteId: number,
  filtros: FiltrosLancamento = {},
): Promise<LancamentoResponse[]> {
  const query = new URLSearchParams();
  if (filtros.dataInicio) query.set("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) query.set("dataFim", filtros.dataFim);
  if (filtros.tipo) query.set("tipo", filtros.tipo);

  const qs = query.toString();
  const path = `/lancamentos/paciente/${pacienteId}${qs ? `?${qs}` : ""}`;
  return apiFetch<LancamentoResponse[]>(path, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function buscarResumoFinanceiro(
  token: string,
  pacienteId: number,
  filtros: Pick<FiltrosLancamento, "dataInicio" | "dataFim"> = {},
): Promise<ResumoFinanceiroResponse> {
  const query = new URLSearchParams();
  if (filtros.dataInicio) query.set("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) query.set("dataFim", filtros.dataFim);

  const qs = query.toString();
  const path = `/lancamentos/paciente/${pacienteId}/resumo${qs ? `?${qs}` : ""}`;
  return apiFetch<ResumoFinanceiroResponse>(path, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
