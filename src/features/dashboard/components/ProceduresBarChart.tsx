import { Stethoscope } from "lucide-react";
import { TIPO_PROCEDIMENTO_LABELS } from "@/features/agenda/types/agenda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardProcedimento } from "../types/dashboard";

interface ProceduresBarChartProps {
  procedimentos: DashboardProcedimento[];
}

const BAR_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ProceduresBarChart({
  procedimentos,
}: ProceduresBarChartProps) {
  const max = Math.max(...procedimentos.map((p) => p.quantidade), 1);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">
          Procedimentos Mais Realizados
        </CardTitle>
      </CardHeader>

      {procedimentos.length === 0 ? (
        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
              <Stethoscope className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhum procedimento registrado
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-3">
          {procedimentos.map((p, i) => {
            const percentage = (p.quantidade / max) * 100;
            const color = BAR_COLORS[i % BAR_COLORS.length];

            return (
              <div key={p.tipo} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {TIPO_PROCEDIMENTO_LABELS[p.tipo] ?? p.tipo}
                  </span>
                  <span className="font-bold tabular-nums text-foreground">
                    {p.quantidade}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
