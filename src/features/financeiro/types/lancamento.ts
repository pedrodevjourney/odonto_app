export interface LancamentoResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  data: string;
  valorTotal: number | null;
  valorPago: number | null;
  valorRestante: number;
  createdAt: string;
  updatedAt: string;
}

export interface LancamentoRequest {
  pacienteId: number;
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  data: string;
  valorTotal?: number;
  valorPago?: number;
}

export interface LancamentoUpdateRequest {
  tipo?: "RECEITA" | "DESPESA";
  descricao?: string;
  data?: string;
  valorTotal?: number;
  valorPago?: number;
}

export interface ResumoFinanceiroResponse {
  pacienteId: number;
  pacienteNome: string;
  totalValorTotal: number;
  totalValorPago: number;
  valorRestanteGeral: number;
}

export interface FiltrosLancamento {
  dataInicio?: string;
  dataFim?: string;
  tipo?: "RECEITA" | "DESPESA";
}
