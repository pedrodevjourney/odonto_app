import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { buscarPaciente } from "@/features/pacientes/services/pacienteService";
import {
  getAnotacoes,
  getDadosDentes,
  getFichasClinicas,
  getHistorico,
  getPlanoTratamento,
} from "@/features/pacientes/services/prontuarioService";
import type { Paciente } from "@/features/pacientes/types/paciente";
import type {
  Anotacao,
  DadosDente,
  FichaClinica,
  HistoricoItem,
  PlanoTratamento,
} from "@/features/pacientes/types/prontuario";

export interface ProntuarioViewModel {
  paciente: Paciente | null;
  dadosDentes: DadosDente[];
  anotacoes: Anotacao[];
  fichasClinicas: FichaClinica[];
  planoTratamento: PlanoTratamento[];
  historico: HistoricoItem[];
  loading: boolean;
  error: string | null;
  refreshDadosDentes: () => Promise<void>;
  refreshAnotacoes: () => Promise<void>;
  refreshFichasClinicas: () => Promise<void>;
  refreshPlanoTratamento: () => Promise<void>;
  refreshHistorico: () => Promise<void>;
}

export function useProntuarioViewModel(pacienteId: number): ProntuarioViewModel {
  const { user } = useAuth();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [dadosDentes, setDadosDentes] = useState<DadosDente[]>([]);
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [fichasClinicas, setFichasClinicas] = useState<FichaClinica[]>([]);
  const [planoTratamento, setPlanoTratamento] = useState<PlanoTratamento[]>([]);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const [p, dentes, anots, fichas, plano, hist] = await Promise.all([
        buscarPaciente(user.token, pacienteId),
        getDadosDentes(user.token, pacienteId),
        getAnotacoes(user.token, pacienteId),
        getFichasClinicas(user.token, pacienteId),
        getPlanoTratamento(user.token, pacienteId),
        getHistorico(user.token, pacienteId),
      ]);
      setPaciente(p);
      setDadosDentes(dentes);
      setAnotacoes(anots);
      setFichasClinicas(fichas);
      setPlanoTratamento(plano);
      setHistorico(hist);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar prontuário.");
    } finally {
      setLoading(false);
    }
  }, [user?.token, pacienteId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const refreshDadosDentes = useCallback(async () => {
    if (!user?.token) return;
    try { setDadosDentes(await getDadosDentes(user.token, pacienteId)); }
    catch { toast.error("Erro ao atualizar odontograma."); }
  }, [user?.token, pacienteId]);

  const refreshAnotacoes = useCallback(async () => {
    if (!user?.token) return;
    try { setAnotacoes(await getAnotacoes(user.token, pacienteId)); }
    catch { toast.error("Erro ao atualizar anotações."); }
  }, [user?.token, pacienteId]);

  const refreshFichasClinicas = useCallback(async () => {
    if (!user?.token) return;
    try { setFichasClinicas(await getFichasClinicas(user.token, pacienteId)); }
    catch { toast.error("Erro ao atualizar ficha clínica."); }
  }, [user?.token, pacienteId]);

  const refreshPlanoTratamento = useCallback(async () => {
    if (!user?.token) return;
    try { setPlanoTratamento(await getPlanoTratamento(user.token, pacienteId)); }
    catch { toast.error("Erro ao atualizar plano de tratamento."); }
  }, [user?.token, pacienteId]);

  const refreshHistorico = useCallback(async () => {
    if (!user?.token) return;
    try { setHistorico(await getHistorico(user.token, pacienteId)); }
    catch { toast.error("Erro ao atualizar histórico."); }
  }, [user?.token, pacienteId]);

  return {
    paciente,
    dadosDentes,
    anotacoes,
    fichasClinicas,
    planoTratamento,
    historico,
    loading,
    error,
    refreshDadosDentes,
    refreshAnotacoes,
    refreshFichasClinicas,
    refreshPlanoTratamento,
    refreshHistorico,
  };
}
