// Numeração FDI (padrão brasileiro)
export const DENTES_FDI = [
  11, 12, 13, 14, 15, 16, 17, 18, // Quadrante 1 — sup. direito
  21, 22, 23, 24, 25, 26, 27, 28, // Quadrante 2 — sup. esquerdo
  31, 32, 33, 34, 35, 36, 37, 38, // Quadrante 3 — inf. esquerdo
  41, 42, 43, 44, 45, 46, 47, 48, // Quadrante 4 — inf. direito
] as const;

export type StatusDente = "SADIO" | "CARIADO" | "RESTAURADO" | "EXTRAIDO" | "IMPLANTE" | "AUSENTE";

export interface DadosDente {
  id: number;
  pacienteId: number;
  numeroDente: number;
  status?: StatusDente;
  cor?: string;
  escurecimento?: string;
  forma?: string;
  observacoes?: string;
  updatedAt: string;
}

export interface DadosDenteFormData {
  numeroDente: number;
  status?: StatusDente;
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

export type StatusTratamento = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";

export interface PlanoTratamento {
  id: number;
  pacienteId: number;
  procedimento: string;
  numeroDente?: number;
  status: StatusTratamento;
  observacoes?: string;
  valor?: number;
  dataPrevista?: string;
  dataConclusao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanoTratamentoFormData {
  procedimento: string;
  numeroDente?: number;
  status?: StatusTratamento;
  observacoes?: string;
  valor?: number;
  dataPrevista?: string;
  dataConclusao?: string;
}

export type TipoRadiografia = "PERIAPICAL" | "PANORAMICA" | "INTERPROXIMAL" | "OCLUSAL" | "CEFALOMETRICA";

export interface Radiografia {
  id: number;
  pacienteId: number;
  dataRealizacao?: string;
  descricao?: string;
  nomeOriginal?: string;
  contentType?: string;
  tipoRadiografia?: TipoRadiografia;
  createdAt: string;
}

export type TipoHistorico = "ANOTACAO" | "FICHA_CLINICA" | "PLANO_TRATAMENTO" | "RADIOGRAFIA" | "CONSULTA" | "LANCAMENTO";

export interface HistoricoItem {
  id: number;
  tipo: TipoHistorico;
  data: string;
  titulo: string;
  descricao: string;
  referenceId: number;
}
