import { apiFetch } from "@/core/api";
import type {
  Consulta,
  ConsultaFormData,
  ConsultaListParams,
} from "../types/agenda";

export async function listarConsultas(
  token: string,
  params: ConsultaListParams,
): Promise<Consulta[]> {
  const query = new URLSearchParams({
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
  });
  if (params.status) {
    query.set("status", params.status);
  }

  return apiFetch<Consulta[]>(`/consultas?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function buscarConsulta(
  token: string,
  id: number,
): Promise<Consulta> {
  return apiFetch<Consulta>(`/consultas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function criarConsulta(
  token: string,
  data: ConsultaFormData,
): Promise<Consulta> {
  return apiFetch<Consulta>("/consultas", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function atualizarConsulta(
  token: string,
  id: number,
  data: Partial<ConsultaFormData>,
): Promise<Consulta> {
  return apiFetch<Consulta>(`/consultas/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function cancelarConsulta(
  token: string,
  id: number,
): Promise<void> {
  return apiFetch<void>(`/consultas/${id}/cancelar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

