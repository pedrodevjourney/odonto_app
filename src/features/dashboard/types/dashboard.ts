import type {
  ConsultaStatus,
  TipoProcedimento,
} from "@/features/agenda/types/agenda";

export interface DashboardPacientes {
  total: number;
  emTratamento: number;
}

export interface DashboardConsultas {
  hoje: number;
  semana: number;
  realizadasMes: number;
  canceladasMes: number;
  naoCompareceuMes: number;
  taxaComparecimentoMes: number;
}

export interface RecebimentoPorForma {
  formaPagamento: string;
  valor: number;
}

export interface DashboardFinanceiro {
  receitaMes: number;
  despesaMes: number;
  saldoMes: number;
  receitaPorFormaMes: RecebimentoPorForma[];
}

export interface ClienteHoje {
  pacienteId: number;
  pacienteNome: string;
  lancamentoId: number;
  descricao: string;
  valorPago: number;
  formaPagamento: string | null;
}

export interface RecebimentoHoje {
  total: number;
  porForma: RecebimentoPorForma[];
  clientes: ClienteHoje[];
}

export interface DashboardProximaConsulta {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: ConsultaStatus;
  tipo: TipoProcedimento;
  observacoes: string | null;
  motivoCancelamento: string | null;
  googleEventId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardProcedimento {
  tipo: TipoProcedimento;
  quantidade: number;
}

export interface AlertaRetorno {
  pacienteId: number;
  pacienteNome: string;
  ultimaConsulta: string | null;
}

export interface DashboardResponse {
  pacientes: DashboardPacientes;
  consultas: DashboardConsultas;
  financeiro: DashboardFinanceiro;
  recebimentoHoje: RecebimentoHoje;
  proximasConsultas: DashboardProximaConsulta[];
  procedimentosMaisRealizados: DashboardProcedimento[];
  alertasRetorno: AlertaRetorno[];
}
