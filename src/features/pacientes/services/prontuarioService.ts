import { apiFetch } from "@/core/api";
import type {
  Anotacao,
  AnotacaoFormData,
  DadosDente,
  DadosDenteFormData,
  FichaClinica,
  FichaClinicaFormData,
} from "@/features/pacientes/types/prontuario";

export async function getDadosDentes(
  token: string,
  pacienteId: number,
): Promise<DadosDente[]> {
  return apiFetch<DadosDente[]>(`/pacientes/${pacienteId}/dados-dentes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addDadosDente(
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

export async function getAnotacoes(
  token: string,
  pacienteId: number,
): Promise<Anotacao[]> {
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

export async function getFichasClinicas(
  token: string,
  pacienteId: number,
): Promise<FichaClinica[]> {
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
