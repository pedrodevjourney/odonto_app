import { apiFetch } from "@/core/api";
import type {
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
