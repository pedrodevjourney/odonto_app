import { cn } from "@/lib/utils";
import { ConsultaStatus } from "../types/agenda";
import { getStatusLabel } from "../utils/agendaHelpers";

const STATUS_STYLES: Record<ConsultaStatus, string> = {
  [ConsultaStatus.CONFIRMADA]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  [ConsultaStatus.PENDENTE]: "bg-amber-50 text-amber-700 ring-amber-600/20",
  [ConsultaStatus.CANCELADA]: "bg-red-50 text-red-700 ring-red-600/20",
  [ConsultaStatus.CONCLUIDA]: "bg-gray-50 text-gray-600 ring-gray-500/20",
};

interface StatusBadgeProps {
  status: ConsultaStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status],
        className,
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
