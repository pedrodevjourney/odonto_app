import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { ResumoFinanceiroResponse } from "@/features/financeiro/types/lancamento";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { cn } from "@/lib/utils";

interface ResumoCardsProps {
  resumo: ResumoFinanceiroResponse;
}

export function ResumoCards({ resumo }: ResumoCardsProps) {
  const saldoPositivo = resumo.saldoGeral >= 0;

  const cards = [
    {
      label: "Total Deve",
      value: resumo.totalDeve,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
    },
    {
      label: "Total Haver",
      value: resumo.totalHaver,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Saldo Geral",
      value: resumo.saldoGeral,
      icon: Wallet,
      color: saldoPositivo ? "text-emerald-600" : "text-red-600",
      bg: saldoPositivo ? "bg-emerald-50" : "bg-red-50",
      iconBg: saldoPositivo ? "bg-emerald-100" : "bg-red-100",
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
