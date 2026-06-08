import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { ResumoFinanceiroResponse } from "@/features/financeiro/types/lancamento";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { cn } from "@/lib/utils";

interface ResumoCardsProps {
  resumo: ResumoFinanceiroResponse;
}

export function ResumoCards({ resumo }: ResumoCardsProps) {
  const quitado = resumo.valorRestanteGeral <= 0;

  const cards = [
    {
      label: "Valor Total",
      value: resumo.totalValorTotal,
      icon: TrendingDown,
      color: "text-foreground/80",
      bg: "bg-muted/40",
      iconBg: "bg-muted",
    },
    {
      label: "Valor Pago",
      value: resumo.totalValorPago,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Valor Restante",
      value: resumo.valorRestanteGeral,
      icon: Wallet,
      color: quitado ? "text-emerald-600" : "text-red-600",
      bg: quitado ? "bg-emerald-50" : "bg-red-50",
      iconBg: quitado ? "bg-emerald-100" : "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "flex items-center gap-4 rounded-2xl border border-border/50 p-5 shadow-sm shadow-black/5",
              card.bg,
            )}
          >
            <div className={cn("flex size-11 items-center justify-center rounded-xl", card.iconBg)}>
              <Icon className={cn("size-5", card.color)} />
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground/70">
                {card.label}
              </p>
              <p className={cn("text-xl font-bold tabular-nums", card.color)}>
                {formatBRL(card.value)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
