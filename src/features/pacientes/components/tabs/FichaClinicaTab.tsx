import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovaFichaClinicaModal } from "@/features/pacientes/components/NovaFichaClinicaModal";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import { formatDate } from "@/features/pacientes/utils/pacienteHelpers";
import type { FichaClinica } from "@/features/pacientes/types/prontuario";
import { cn } from "@/lib/utils";

interface FichaClinicaTabProps {
  pacienteId: number;
  fichasClinicas: FichaClinica[];
  onRefresh: () => void;
}

function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FichaClinicaTab({
  pacienteId,
  fichasClinicas,
  onRefresh,
}: FichaClinicaTabProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...fichasClinicas].sort((a, b) =>
    b.data.localeCompare(a.data),
  );

  return (
    <>
      <NovaFichaClinicaModal
        open={modalOpen}
        pacienteId={pacienteId}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {fichasClinicas.length} entr{fichasClinicas.length !== 1 ? "adas" : "ada"}
          </p>
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-8 gap-1.5 text-[13px]"
          >
            <Plus className="size-3.5" />
            Nova Entrada
          </Button>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma entrada na ficha clínica"
            description="Registre procedimentos e movimentações financeiras."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/35">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Dente
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Procedimento
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Deve
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Haver
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-white">
                {sorted.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground/70">
                      {formatDate(f.data)}
                    </td>
                    <td className="px-4 py-3">
                      {f.numeroDente ? (
                        <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                          {f.numeroDente}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground/70">
                      {f.observacoesClinicas ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground/70">
                      {formatCurrency(f.deve)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground/70">
                      {formatCurrency(f.haver)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-medium tabular-nums",
                        f.saldo !== undefined && f.saldo < 0
                          ? "text-destructive/80"
                          : "text-foreground/80",
                      )}
                    >
                      {formatCurrency(f.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
