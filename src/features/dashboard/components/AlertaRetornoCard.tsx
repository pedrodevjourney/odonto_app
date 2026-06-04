import { useNavigate } from "react-router-dom";
import { AlertTriangle, UserRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AlertaRetorno } from "@/features/dashboard/types/dashboard";

interface AlertaRetornoCardProps {
  alertas: AlertaRetorno[];
}

function diasDesde(dataStr: string | null): string {
  if (!dataStr) return "Nunca atendido";
  const dias = Math.floor((Date.now() - new Date(dataStr).getTime()) / 86_400_000);
  if (dias === 0) return "Hoje";
  if (dias === 1) return "Ontem";
  return `Há ${dias} dias`;
}

export function AlertaRetornoCard({ alertas }: AlertaRetornoCardProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-black/5">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-5 py-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100">
          <AlertTriangle className="size-3.5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Alerta de Retorno</p>
          <p className="text-[11px] text-muted-foreground/60">
            Pacientes sem consulta há mais de 3 meses
          </p>
        </div>
        <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
          {alertas.length}
        </span>
      </div>

      {alertas.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground/50">
          Todos os pacientes estão em dia.
        </div>
      ) : (
        <ul className="divide-y divide-border/30">
          {alertas.slice(0, 8).map((a) => (
            <li
              key={a.pacienteId}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/50">
                <UserRound className="size-4 text-muted-foreground/50" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground/85">{a.pacienteNome}</p>
                <p className="text-[11px] text-amber-600/80">{diasDesde(a.ultimaConsulta)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => navigate(`/dashboard/pacientes/${a.pacienteId}`)}
              >
                <ArrowRight className="size-3.5" />
              </Button>
            </li>
          ))}
          {alertas.length > 8 && (
            <li className="px-5 py-2.5 text-center text-[11px] text-muted-foreground/50">
              + {alertas.length - 8} pacientes
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
