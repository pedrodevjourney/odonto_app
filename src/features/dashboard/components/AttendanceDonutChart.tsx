import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardConsultas } from "../types/dashboard";

interface AttendanceDonutChartProps {
  consultas: DashboardConsultas;
}

const RADIUS = 52;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AttendanceDonutChart({
  consultas,
}: AttendanceDonutChartProps) {
  const taxa = consultas.taxaComparecimentoMes;
  const offset = CIRCUMFERENCE * (1 - taxa / 100);

  const legendItems = [
    {
      label: "Realizadas",
      value: consultas.realizadasMes,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Canceladas",
      value: consultas.canceladasMes,
      color: "bg-red-500",
      textColor: "text-red-500",
    },
    {
      label: "Não Compareceu",
      value: consultas.naoCompareceuMes,
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
  ];

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">
          Taxa de Comparecimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative shrink-0">
            <svg
              width="128"
              height="128"
              viewBox="0 0 120 120"
              className="-rotate-90"
            >
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                className="text-muted"
              />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={cn(
                  "transition-[stroke-dashoffset] duration-700 ease-out",
                  taxa >= 70 ? "text-emerald-500" : "text-amber-500",
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums text-foreground">
                {taxa.toFixed(0)}%
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                presença
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {legendItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", item.color)}
                />
                <span className="flex-1 text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className={cn("text-sm font-bold tabular-nums", item.textColor)}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
