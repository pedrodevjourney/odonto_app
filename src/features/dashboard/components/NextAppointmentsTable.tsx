import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TIPO_PROCEDIMENTO_LABELS } from "@/features/agenda/types/agenda";
import {
  STATUS_LABELS,
  STATUS_BADGE_STYLES,
} from "@/features/agenda/constants/statusConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardProximaConsulta } from "../types/dashboard";

interface NextAppointmentsTableProps {
  consultas: DashboardProximaConsulta[];
}

export function NextAppointmentsTable({
  consultas,
}: NextAppointmentsTableProps) {
  const limitadas = consultas.slice(0, 5);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">
          Próximas Consultas
        </CardTitle>
      </CardHeader>

      {limitadas.length === 0 ? (
        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
              <CalendarClock className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma consulta agendada
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-muted/50">
                  <th className="px-6 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Paciente
                  </th>
                  <th className="px-6 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Data/Hora
                  </th>
                  <th className="px-6 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tipo
                  </th>
                  <th className="px-6 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {limitadas.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-6 py-2 font-medium text-foreground">
                      {c.pacienteNome}
                    </td>
                    <td className="whitespace-nowrap px-6 py-2 tabular-nums text-muted-foreground">
                      {format(new Date(c.dataHoraInicio), "dd MMM · HH:mm", {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-2 text-muted-foreground">
                      {TIPO_PROCEDIMENTO_LABELS[c.tipo] ?? c.tipo}
                    </td>
                    <td className="whitespace-nowrap px-6 py-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                          STATUS_BADGE_STYLES[c.status],
                        )}
                      >
                        {STATUS_LABELS[c.status] ?? c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
