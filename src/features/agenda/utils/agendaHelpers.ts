import { format, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EventInput } from "@fullcalendar/core";
import {
  ConsultaStatus,
  TIPO_PROCEDIMENTO_LABELS,
  type Consulta,
} from "../types/agenda";

const STATUS_COLORS: Record<ConsultaStatus, string> = {
  [ConsultaStatus.AGENDADA]: "#d97706",
  [ConsultaStatus.CONFIRMADA]: "#16a34a",
  [ConsultaStatus.REALIZADA]: "#6b7280",
  [ConsultaStatus.CANCELADA]: "#dc2626",
  [ConsultaStatus.NAO_COMPARECEU]: "#7c3aed",
};

const STATUS_LABELS: Record<ConsultaStatus, string> = {
  [ConsultaStatus.AGENDADA]: "Agendada",
  [ConsultaStatus.CONFIRMADA]: "Confirmada",
  [ConsultaStatus.REALIZADA]: "Realizada",
  [ConsultaStatus.CANCELADA]: "Cancelada",
  [ConsultaStatus.NAO_COMPARECEU]: "Não Compareceu",
};

export function getStatusColor(status: ConsultaStatus): string {
  return STATUS_COLORS[status];
}

export function getStatusLabel(status: ConsultaStatus): string {
  return STATUS_LABELS[status];
}

export function consultaToCalendarEvent(consulta: Consulta): EventInput {
  return {
    id: String(consulta.id),
    title: `${consulta.pacienteNome} — ${TIPO_PROCEDIMENTO_LABELS[consulta.tipo]}`,
    start: consulta.dataHoraInicio,
    end: consulta.dataHoraFim,
    backgroundColor: getStatusColor(consulta.status),
    borderColor: getStatusColor(consulta.status),
    extendedProps: {
      consulta,
    },
  };
}

export function formatTimeRange(start: string, end: string): string {
  return `${format(new Date(start), "HH:mm")} - ${format(new Date(end), "HH:mm")}`;
}

export function formatConsultaDate(dateStr: string): string {
  return format(new Date(dateStr), "EEE, dd MMM yyyy", { locale: ptBR });
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

export function toLocalDateTimeString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}
