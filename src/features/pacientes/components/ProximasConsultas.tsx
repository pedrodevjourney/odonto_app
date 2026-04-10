import { CalendarClock, Clock } from "lucide-react";
import type { Consulta } from "@/features/agenda/types/agenda";
import { TIPO_PROCEDIMENTO_LABELS } from "@/features/agenda/types/agenda";
import {
  STATUS_LABELS,
  STATUS_BADGE_STYLES,
} from "@/features/agenda/constants/statusConfig";

interface ProximasConsultasProps {
  consultas: Consulta[];
}

function formatarData(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarHora(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function diasAte(iso: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = new Date(iso);
  data.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  return `Em ${diff} dias`;
}

export function ProximasConsultas({ consultas }: ProximasConsultasProps) {
  if (consultas.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-black/5">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
          <CalendarClock className="size-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Próximas Consultas
          </h3>
          <p className="text-[11px] text-muted-foreground/60">
            {consultas.length === 1
              ? "1 consulta agendada"
              : `${consultas.length} consultas agendadas`}
          </p>
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {consultas.map((consulta) => {
          const badgeStyle = STATUS_BADGE_STYLES[consulta.status];
          return (
            <div
              key={consulta.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/20"
            >
              {/* Date pill */}
              <div className="flex min-w-[90px] flex-col items-center rounded-xl bg-primary/10 px-3 py-2.5">
                <span className="text-[22px] font-bold leading-none text-primary">
                  {new Date(consulta.dataHoraInicio).getDate()}
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase text-primary/70">
                  {new Date(consulta.dataHoraInicio).toLocaleDateString(
                    "pt-BR",
                    { month: "short" },
                  )}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {TIPO_PROCEDIMENTO_LABELS[consulta.tipo]}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${badgeStyle}`}
                  >
                    {STATUS_LABELS[consulta.status]}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatarHora(consulta.dataHoraInicio)} –{" "}
                    {formatarHora(consulta.dataHoraFim)}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="capitalize">
                    {formatarData(consulta.dataHoraInicio)}
                  </span>
                </div>

                {consulta.observacoes && (
                  <p className="mt-1 truncate text-xs text-muted-foreground/60">
                    {consulta.observacoes}
                  </p>
                )}
              </div>

              {/* Countdown */}
              <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {diasAte(consulta.dataHoraInicio)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
