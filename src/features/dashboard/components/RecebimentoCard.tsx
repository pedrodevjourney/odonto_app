import { Banknote, CreditCard, QrCode, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecebimentoPorForma } from "../types/dashboard";

const FORMA_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; iconBg: string }
> = {
  DINHEIRO: {
    label: "Dinheiro",
    icon: Banknote,
    color: "text-emerald-700",
    iconBg: "bg-emerald-500/10",
  },
  PIX: {
    label: "Pix",
    icon: QrCode,
    color: "text-sky-700",
    iconBg: "bg-sky-500/10",
  },
  CARTAO: {
    label: "Cartão",
    icon: CreditCard,
    color: "text-violet-700",
    iconBg: "bg-violet-500/10",
  },
  NAO_INFORMADO: {
    label: "Não informado",
    icon: HelpCircle,
    color: "text-muted-foreground",
    iconBg: "bg-muted",
  },
};

interface RecebimentoCardProps {
  title: string;
  total: number;
  porForma: RecebimentoPorForma[];
}

export function RecebimentoCard({ title, total, porForma }: RecebimentoCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {formatBRL(total)}
          </span>
          <span className="text-xs text-muted-foreground">total recebido</span>
        </div>

        {porForma.length > 0 ? (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            {porForma.map((item, index) => {
              const config = FORMA_CONFIG[item.formaPagamento] ?? FORMA_CONFIG.NAO_INFORMADO;
              const Icon = config.icon;
              const pct = total > 0 ? (item.valor / total) * 100 : 0;

              return (
                <div key={item.formaPagamento}>
                  <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors duration-150">
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg",
                        config.iconBg,
                      )}
                    >
                      <Icon className={cn("size-3.5", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {config.label}
                        </span>
                        <span className={cn("text-sm font-bold tabular-nums", config.color)}>
                          {formatBRL(item.valor)}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.formaPagamento === "DINHEIRO" && "bg-emerald-500",
                            item.formaPagamento === "PIX" && "bg-sky-500",
                            item.formaPagamento === "CARTAO" && "bg-violet-500",
                            item.formaPagamento === "NAO_INFORMADO" && "bg-muted-foreground/30",
                          )}
                          style={{ width: `${pct.toFixed(1)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground w-9 text-right tabular-nums">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  {index < porForma.length - 1 && (
                    <div className="h-px bg-border/60" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground/60 py-4">
            Nenhum recebimento registrado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
