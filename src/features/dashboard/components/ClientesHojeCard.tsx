import { Users, Banknote, CreditCard, QrCode, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { ClienteHoje } from "../types/dashboard";

const FORMA_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; badge: string }
> = {
  DINHEIRO: { label: "Dinheiro", icon: Banknote, badge: "bg-emerald-100 text-emerald-700" },
  PIX: { label: "Pix", icon: QrCode, badge: "bg-sky-100 text-sky-700" },
  CARTAO: { label: "Cartão", icon: CreditCard, badge: "bg-violet-100 text-violet-700" },
  NAO_INFORMADO: { label: "Não inf.", icon: HelpCircle, badge: "bg-muted text-muted-foreground" },
};

interface ClientesHojeCardProps {
  clientes: ClienteHoje[];
}

export function ClientesHojeCard({ clientes }: ClientesHojeCardProps) {
  const navigate = useNavigate();

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Recebimentos de Hoje
          </CardTitle>
          <span className="text-xs font-medium text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
            {clientes.length} {clientes.length === 1 ? "registro" : "registros"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {clientes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Users className="size-4 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground/60">
              Nenhum pagamento registrado hoje
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            {clientes.map((c, index) => {
              const forma = c.formaPagamento ?? "NAO_INFORMADO";
              const config = FORMA_CONFIG[forma] ?? FORMA_CONFIG.NAO_INFORMADO;
              const Icon = config.icon;

              return (
                <div key={c.lancamentoId}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/dashboard/pacientes/${c.pacienteId}/financeiro`, {
                        state: { backTo: "/dashboard", backLabel: "Dashboard" },
                      })
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors duration-150 text-left"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-[11px] font-bold text-primary">
                        {c.pacienteNome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {c.pacienteNome}
                      </p>
                      <p className="text-[12px] text-muted-foreground truncate">
                        {c.descricao}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          config.badge,
                        )}
                      >
                        <Icon className="size-3" />
                        {config.label}
                      </span>
                      <span className="text-sm font-bold tabular-nums text-emerald-600">
                        {formatBRL(c.valorPago)}
                      </span>
                    </div>
                  </button>
                  {index < clientes.length - 1 && (
                    <div className="h-px bg-border/60" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
