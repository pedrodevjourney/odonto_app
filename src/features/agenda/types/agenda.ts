export const TipoProcedimento = {
  CONSULTA: "CONSULTA",
  RETORNO: "RETORNO",
  AVALIACAO: "AVALIACAO",
  EMERGENCIA: "EMERGENCIA",
  LIMPEZA: "LIMPEZA",
  RESTAURACAO: "RESTAURACAO",
  EXTRACAO: "EXTRACAO",
  ENDODONTIA: "ENDODONTIA",
  ORTODONTIA: "ORTODONTIA",
  IMPLANTE: "IMPLANTE",
} as const;

export type TipoProcedimento =
  (typeof TipoProcedimento)[keyof typeof TipoProcedimento];

export const TIPO_PROCEDIMENTO_LABELS: Record<TipoProcedimento, string> = {
  CONSULTA: "Consulta",
  RETORNO: "Retorno",
  AVALIACAO: "Avaliação",
  EMERGENCIA: "Emergência",
  LIMPEZA: "Limpeza",
  RESTAURACAO: "Restauração",
  EXTRACAO: "Extração",
  ENDODONTIA: "Endodontia",
  ORTODONTIA: "Ortodontia",
  IMPLANTE: "Implante",
};

export const ConsultaStatus = {
  AGENDADA: "AGENDADA",
  CONFIRMADA: "CONFIRMADA",
  REALIZADA: "REALIZADA",
  CANCELADA: "CANCELADA",
  NAO_COMPARECEU: "NAO_COMPARECEU",
} as const;

export type ConsultaStatus =
  (typeof ConsultaStatus)[keyof typeof ConsultaStatus];

export interface Consulta {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: ConsultaStatus;
  observacoes?: string;
  tipo: TipoProcedimento;
  googleEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultaFormData {
  pacienteId: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  observacoes?: string;
  tipo: TipoProcedimento;
  status?: ConsultaStatus;
  googleEventId?: string;
}

export interface ConsultaListParams {
  dataInicio: string;
  dataFim: string;
  status?: ConsultaStatus;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  colorId?: string;
  htmlLink?: string;
}
