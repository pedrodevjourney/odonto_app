import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  listarLancamentosPorPaciente,
  buscarResumoFinanceiro,
  excluirLancamento,
} from "@/features/financeiro/services/lancamentoService";
import type {
  LancamentoResponse,
  ResumoFinanceiroResponse,
  FiltrosLancamento,
} from "@/features/financeiro/types/lancamento";

export interface FinanceiroViewModel {
  lancamentos: LancamentoResponse[];
  resumo: ResumoFinanceiroResponse | null;
  loading: boolean;
  error: string | null;
  filtros: FiltrosLancamento;
  setFiltros: (filtros: FiltrosLancamento) => void;
  refresh: () => void;
  handleExcluir: (id: number) => Promise<void>;
}

export function useFinanceiroViewModel(
  pacienteId: number,
): FinanceiroViewModel {
  const { user } = useAuth();

  const [lancamentos, setLancamentos] = useState<LancamentoResponse[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiroResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosLancamento>({});

  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const [lancamentosRes, resumoRes] = await Promise.all([
        listarLancamentosPorPaciente(user.token, pacienteId, filtros),
        buscarResumoFinanceiro(user.token, pacienteId, {
          dataInicio: filtros.dataInicio,
          dataFim: filtros.dataFim,
        }),
      ]);
      setLancamentos(lancamentosRes);
      setResumo(resumoRes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados financeiros.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.token, pacienteId, filtros]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleExcluir(id: number) {
    if (!user?.token) return;
    try {
      await excluirLancamento(user.token, id);
      toast.success("Lançamento excluído com sucesso.");
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao excluir lançamento.",
      );
    }
  }

  return {
    lancamentos,
    resumo,
    loading,
    error,
    filtros,
    setFiltros,
    refresh: fetchData,
    handleExcluir,
  };
}
