import { cn } from "@/lib/utils";
import { ConsultaStatus } from "../types/agenda";
import { getStatusLabel, getStatusBadgeStyle } from "../constants/statusConfig";

interface StatusBadgeProps {
  status: ConsultaStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        getStatusBadgeStyle(status),
        className,
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
