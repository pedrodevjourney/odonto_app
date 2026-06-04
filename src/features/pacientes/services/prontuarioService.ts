import { apiFetch } from "@/core/api";
import type {
  Anotacao,
  AnotacaoFormData,
  DadosDente,
  DadosDenteFormData,
  FichaClinica,
  FichaClinicaFormData,
  HistoricoItem,
  PlanoTratamento,
  PlanoTratamentoFormData,
  Radiografia,
} from "@/features/pacientes/types/prontuario";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function getDadosDentes(token: string, pacienteId: number): Promise<DadosDente[]> {
  return apiFetch<DadosDente[]>(`/pacientes/${pacienteId}/dados-dentes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function salvarDadosDente(
  token: string,
  pacienteId: number,
  data: DadosDenteFormData,
): Promise<DadosDente> {
  return apiFetch<DadosDente>(`/pacientes/${pacienteId}/dados-dentes`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getAnotacoes(token: string, pacienteId: number): Promise<Anotacao[]> {
  return apiFetch<Anotacao[]>(`/pacientes/${pacienteId}/anotacoes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addAnotacao(
  token: string,
  pacienteId: number,
  data: AnotacaoFormData,
): Promise<Anotacao> {
  return apiFetch<Anotacao>(`/pacientes/${pacienteId}/anotacoes`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getFichasClinicas(token: string, pacienteId: number): Promise<FichaClinica[]> {
  return apiFetch<FichaClinica[]>(`/pacientes/${pacienteId}/fichas-clinicas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addFichaClinica(
  token: string,
  pacienteId: number,
  data: FichaClinicaFormData,
): Promise<FichaClinica> {
  return apiFetch<FichaClinica>(`/pacientes/${pacienteId}/fichas-clinicas`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPlanoTratamento(token: string, pacienteId: number): Promise<PlanoTratamento[]> {
  return apiFetch<PlanoTratamento[]>(`/pacientes/${pacienteId}/plano-tratamento`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addItemPlano(
  token: string,
  pacienteId: number,
  data: PlanoTratamentoFormData,
): Promise<PlanoTratamento> {
  return apiFetch<PlanoTratamento>(`/pacientes/${pacienteId}/plano-tratamento`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateItemPlano(
  token: string,
  pacienteId: number,
  itemId: number,
  data: PlanoTratamentoFormData,
): Promise<PlanoTratamento> {
  return apiFetch<PlanoTratamento>(`/pacientes/${pacienteId}/plano-tratamento/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteItemPlano(
  token: string,
  pacienteId: number,
  itemId: number,
): Promise<void> {
  return apiFetch<void>(`/pacientes/${pacienteId}/plano-tratamento/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRadiografias(token: string, pacienteId: number): Promise<Radiografia[]> {
  return apiFetch<Radiografia[]>(`/pacientes/${pacienteId}/radiografias`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadRadiografia(
  token: string,
  pacienteId: number,
  arquivo: File,
  descricao?: string,
  tipo?: string,
  dataRealizacao?: string,
): Promise<Radiografia> {
  const form = new FormData();
  form.append("arquivo", arquivo);
  if (descricao) form.append("descricao", descricao);
  if (tipo) form.append("tipo", tipo);
  if (dataRealizacao) form.append("dataRealizacao", dataRealizacao);

  const response = await fetch(`${BASE_URL}/pacientes/${pacienteId}/radiografias`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string })?.message ?? "Erro ao enviar radiografia");
  }
  return response.json() as Promise<Radiografia>;
}

export async function deleteRadiografia(
  token: string,
  pacienteId: number,
  radiografiaId: number,
): Promise<void> {
  return apiFetch<void>(`/pacientes/${pacienteId}/radiografias/${radiografiaId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchRadiografiaBlob(
  token: string,
  pacienteId: number,
  radiografiaId: number,
): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/pacientes/${pacienteId}/radiografias/${radiografiaId}/arquivo`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) throw new Error("Falha ao carregar imagem");
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function getHistorico(token: string, pacienteId: number): Promise<HistoricoItem[]> {
  return apiFetch<HistoricoItem[]>(`/pacientes/${pacienteId}/historico`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
