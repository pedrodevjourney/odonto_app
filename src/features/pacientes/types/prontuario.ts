// Numeração FDI (padrão brasileiro)
export const DENTES_FDI = [
  11, 12, 13, 14, 15, 16, 17, 18, // Quadrante 1 — sup. direito
  21, 22, 23, 24, 25, 26, 27, 28, // Quadrante 2 — sup. esquerdo
  31, 32, 33, 34, 35, 36, 37, 38, // Quadrante 3 — inf. esquerdo
  41, 42, 43, 44, 45, 46, 47, 48, // Quadrante 4 — inf. direito
] as const;

export interface DadosDente {
  id: number;
  pacienteId: number;
  numeroDente: number;
  cor?: string;
  escurecimento?: string;
  forma?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DadosDenteFormData {
  numeroDente: number;
  cor?: string;
  escurecimento?: string;
  forma?: string;
  observacoes?: string;
}

export interface Anotacao {
  id: number;
  pacienteId: number;
  dataAnotacao: string;
  conteudo: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnotacaoFormData {
  dataAnotacao: string;
  conteudo: string;
}

export interface FichaClinica {
  id: number;
  pacienteId: number;
  data: string;
  numeroDente?: number;
  observacoesClinicas?: string;
  deve?: number;
  haver?: number;
  saldo?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FichaClinicaFormData {
  data: string;
  numeroDente?: number;
  observacoesClinicas?: string;
  deve?: number;
  haver?: number;
  saldo?: number;
}
