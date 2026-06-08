export type FormaPagamento = "DINHEIRO" | "PIX" | "CARTAO";

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
  formaPagamento: FormaPagamento | null;
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
  formaPagamento?: FormaPagamento;
}

export interface LancamentoUpdateRequest {
  tipo?: "RECEITA" | "DESPESA";
  descricao?: string;
  data?: string;
  valorTotal?: number;
  valorPago?: number;
  formaPagamento?: FormaPagamento;
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

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "Pix",
  CARTAO: "Cartão",
};
