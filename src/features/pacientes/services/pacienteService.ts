import { apiFetch } from "@/core/api";
import type {
  Paciente,
  PacienteFormData,
  PacientePage,
  PacienteListParams,
} from "@/features/pacientes/types/paciente";

export async function listarPacientes(
  token: string,
  params: PacienteListParams = {},
): Promise<PacientePage> {
  const { page = 0, size = 20, sort = "nome,asc", nome } = params;
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  if (nome?.trim()) query.set("nome", nome.trim());

  return apiFetch<PacientePage>(`/pacientes?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function cadastrarPaciente(
  token: string,
  data: PacienteFormData,
): Promise<Paciente> {
  return apiFetch<Paciente>("/pacientes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function excluirPaciente(
  token: string,
  id: number,
): Promise<void> {
  return apiFetch<void>(`/pacientes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
