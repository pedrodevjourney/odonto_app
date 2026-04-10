export interface LancamentoResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  data: string;
  deve: number | null;
  haver: number | null;
  saldo: number;
  createdAt: string;
  updatedAt: string;
}

export interface LancamentoRequest {
  pacienteId: number;
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  data: string;
  deve?: number;
  haver?: number;
}

export interface LancamentoUpdateRequest {
  tipo?: "RECEITA" | "DESPESA";
  descricao?: string;
  data?: string;
  deve?: number;
  haver?: number;
}

export interface ResumoFinanceiroResponse {
  pacienteId: number;
  pacienteNome: string;
  totalDeve: number;
  totalHaver: number;
  saldoGeral: number;
}

export interface FiltrosLancamento {
  dataInicio?: string;
  dataFim?: string;
  tipo?: "RECEITA" | "DESPESA";
}
