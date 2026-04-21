import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardConsultas } from "../types/dashboard";

interface AttendanceDonutChartProps {
  consultas: DashboardConsultas;
}

// Increased viewBox padding to avoid stroke clipping
const SIZE = 136;
const CX = 68;
const CY = 68;
const RADIUS = 48;
const STROKE = 11;
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
      dot: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Canceladas",
      value: consultas.canceladasMes,
      dot: "bg-red-500",
      textColor: "text-red-500",
    },
    {
      label: "Não Compareceu",
      value: consultas.naoCompareceuMes,
      dot: "bg-amber-500",
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
        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative shrink-0">
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="-rotate-90"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                cx={CX}
                cy={CY}
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                className="text-muted"
              />
              {/* Progress */}
              <circle
                cx={CX}
                cy={CY}
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
              <span className="text-2xl font-bold tabular-nums leading-none text-foreground">
                {taxa.toFixed(0)}%
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                presença
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 rounded-xl border border-border/60 overflow-hidden">
            {legendItems.map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center gap-3 px-3.5 py-3 bg-card hover:bg-muted/30 transition-colors duration-150">
                  <span
                    className={cn("size-2 shrink-0 rounded-full", item.dot)}
                  />
                  <span className="flex-1 text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold tabular-nums",
                      item.textColor,
                    )}
                  >
                    {item.value}
                  </span>
                </div>
                {index < legendItems.length - 1 && (
                  <div className="h-px bg-border/60" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
