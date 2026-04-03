import { ConsultaStatus } from "../types/agenda";

export interface StatusColorConfig {
  border: string;
  bg: string;
  text: string;
  time: string;
}

export const STATUS_COLORS: Record<ConsultaStatus, StatusColorConfig> = {
  [ConsultaStatus.AGENDADA]: {
    border: "#d97706",
    bg: "#fffbeb",
    text: "#78350f",
    time: "#b45309",
  },
  [ConsultaStatus.CONFIRMADA]: {
    border: "#16a34a",
    bg: "#f0fdf4",
    text: "#14532d",
    time: "#15803d",
  },
  [ConsultaStatus.REALIZADA]: {
    border: "#6b7280",
    bg: "#f9fafb",
    text: "#374151",
    time: "#6b7280",
  },
  [ConsultaStatus.CANCELADA]: {
    border: "#dc2626",
    bg: "#fef2f2",
    text: "#7f1d1d",
    time: "#b91c1c",
  },
  [ConsultaStatus.NAO_COMPARECEU]: {
    border: "#7c3aed",
    bg: "#faf5ff",
    text: "#4c1d95",
    time: "#6d28d9",
  },
};

export const STATUS_LABELS: Record<ConsultaStatus, string> = {
  [ConsultaStatus.AGENDADA]: "Agendada",
  [ConsultaStatus.CONFIRMADA]: "Confirmada",
  [ConsultaStatus.REALIZADA]: "Realizada",
  [ConsultaStatus.CANCELADA]: "Cancelada",
  [ConsultaStatus.NAO_COMPARECEU]: "Não Compareceu",
};

export const STATUS_BADGE_STYLES: Record<ConsultaStatus, string> = {
  [ConsultaStatus.AGENDADA]: "bg-amber-50 text-amber-700 ring-amber-600/20",
  [ConsultaStatus.CONFIRMADA]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  [ConsultaStatus.REALIZADA]: "bg-gray-50 text-gray-600 ring-gray-500/20",
  [ConsultaStatus.CANCELADA]: "bg-red-50 text-red-700 ring-red-600/20",
  [ConsultaStatus.NAO_COMPARECEU]:
    "bg-purple-50 text-purple-700 ring-purple-600/20",
};

export function getStatusColor(status: ConsultaStatus): StatusColorConfig {
  return STATUS_COLORS[status];
}

export function getStatusLabel(status: ConsultaStatus): string {
  return STATUS_LABELS[status];
}

export function getStatusBadgeStyle(status: ConsultaStatus): string {
  return STATUS_BADGE_STYLES[status];
}
