import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardFinanceiro } from "../types/dashboard";

interface FinancialSummaryCardProps {
  financeiro: DashboardFinanceiro;
}

export function FinancialSummaryCard({
  financeiro,
}: FinancialSummaryCardProps) {
  const saldoPositivo = financeiro.saldoMes >= 0;

  const items = [
    {
      label: "Receita",
      value: financeiro.receitaMes,
      icon: TrendingUp,
      color: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      label: "Despesa",
      value: financeiro.despesaMes,
      icon: TrendingDown,
      color: "text-red-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
    },
    {
      label: "Saldo",
      value: financeiro.saldoMes,
      icon: Wallet,
      color: saldoPositivo ? "text-emerald-600" : "text-red-500",
      iconBg: saldoPositivo ? "bg-emerald-500/10" : "bg-red-500/10",
      iconColor: saldoPositivo ? "text-emerald-600" : "text-red-500",
    },
  ];

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">
          Financeiro do Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
            >
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  item.iconBg,
                )}
              >
                <Icon className={cn("size-4", item.iconColor)} />
              </div>
              <span className="flex-1 text-sm font-medium text-muted-foreground">
                {item.label}
              </span>
              <span
                className={cn(
                  "text-base font-bold tabular-nums",
                  item.color,
                )}
              >
                {formatBRL(item.value)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
