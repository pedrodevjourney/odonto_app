import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { buscarPaciente } from "@/features/pacientes/services/pacienteService";
import {
  getAnotacoes,
  getDadosDentes,
  getFichasClinicas,
} from "@/features/pacientes/services/prontuarioService";
import type { Paciente } from "@/features/pacientes/types/paciente";
import type {
  Anotacao,
  DadosDente,
  FichaClinica,
} from "@/features/pacientes/types/prontuario";

export interface ProntuarioViewModel {
  paciente: Paciente | null;
  dadosDentes: DadosDente[];
  anotacoes: Anotacao[];
  fichasClinicas: FichaClinica[];
  loading: boolean;
  error: string | null;
  refreshDadosDentes: () => Promise<void>;
  refreshAnotacoes: () => Promise<void>;
  refreshFichasClinicas: () => Promise<void>;
}

export function useProntuarioViewModel(pacienteId: number): ProntuarioViewModel {
  const { user } = useAuth();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [dadosDentes, setDadosDentes] = useState<DadosDente[]>([]);
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [fichasClinicas, setFichasClinicas] = useState<FichaClinica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const [p, dentes, anots, fichas] = await Promise.all([
        buscarPaciente(user.token, pacienteId),
        getDadosDentes(user.token, pacienteId),
        getAnotacoes(user.token, pacienteId),
        getFichasClinicas(user.token, pacienteId),
      ]);
      setPaciente(p);
      setDadosDentes(dentes);
      setAnotacoes(anots);
      setFichasClinicas(fichas);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar prontuário.");
    } finally {
      setLoading(false);
    }
  }, [user?.token, pacienteId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refreshDadosDentes = useCallback(async () => {
    if (!user?.token) return;
    try {
      setDadosDentes(await getDadosDentes(user.token, pacienteId));
    } catch {
      toast.error("Erro ao atualizar dados dos dentes.");
    }
  }, [user?.token, pacienteId]);

  const refreshAnotacoes = useCallback(async () => {
    if (!user?.token) return;
    try {
      setAnotacoes(await getAnotacoes(user.token, pacienteId));
    } catch {
      toast.error("Erro ao atualizar anotações.");
    }
  }, [user?.token, pacienteId]);

  const refreshFichasClinicas = useCallback(async () => {
    if (!user?.token) return;
    try {
      setFichasClinicas(await getFichasClinicas(user.token, pacienteId));
    } catch {
      toast.error("Erro ao atualizar ficha clínica.");
    }
  }, [user?.token, pacienteId]);

  return {
    paciente,
    dadosDentes,
    anotacoes,
    fichasClinicas,
    loading,
    error,
    refreshDadosDentes,
    refreshAnotacoes,
    refreshFichasClinicas,
  };
}
