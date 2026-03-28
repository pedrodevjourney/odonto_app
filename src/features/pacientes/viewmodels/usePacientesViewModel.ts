import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { listarPacientes } from "@/features/pacientes/services/pacienteService";
import type {
  Paciente,
  PacientePage,
} from "@/features/pacientes/types/paciente";

export interface PacientesViewModel {
  pacientes: Paciente[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;
  openActionId: number | null;
  setOpenActionId: (id: number | null) => void;
  retry: () => void;
}

export function usePacientesViewModel(): PacientesViewModel {
  const { user } = useAuth();

  const [pageData, setPageData] = useState<PacientePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPacientes = useCallback(
    async (nome?: string) => {
      if (!user?.token) return;
      setLoading(true);
      setError(null);
      try {
        const result = await listarPacientes(user.token, { nome });
        setPageData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar pacientes.",
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.token],
  );

  useEffect(() => {
    fetchPacientes(debouncedSearch || undefined);
  }, [fetchPacientes, debouncedSearch]);

  return {
    pacientes: pageData?.content ?? [],
    loading,
    error,
    search,
    setSearch,
    openActionId,
    setOpenActionId,
    retry: () => fetchPacientes(debouncedSearch || undefined),
  };
}
