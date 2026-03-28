import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { startOfWeek, endOfWeek } from "date-fns";
import type { EventInput } from "@fullcalendar/core";
import {
  ConsultaStatus,
  TIPO_PROCEDIMENTO_LABELS,
  type Consulta,
} from "../types/agenda";

const STATUS_COLORS: Record<ConsultaStatus, string> = {
  [ConsultaStatus.CONFIRMADA]: "#16a34a",
  [ConsultaStatus.PENDENTE]: "#d97706",
  [ConsultaStatus.CANCELADA]: "#dc2626",
  [ConsultaStatus.CONCLUIDA]: "#6b7280",
};

const STATUS_LABELS: Record<ConsultaStatus, string> = {
  [ConsultaStatus.CONFIRMADA]: "Confirmada",
  [ConsultaStatus.PENDENTE]: "Pendente",
  [ConsultaStatus.CANCELADA]: "Cancelada",
  [ConsultaStatus.CONCLUIDA]: "Concluída",
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
