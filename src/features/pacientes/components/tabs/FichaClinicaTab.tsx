import { useState } from "react";
import { Plus, ClipboardList, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NovaFichaClinicaModal } from "@/features/pacientes/components/NovaFichaClinicaModal";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import { deleteFichaClinica } from "@/features/pacientes/services/prontuarioService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useConfirm } from "@/hooks/useConfirm";
import { formatDate } from "@/features/pacientes/utils/pacienteHelpers";
import { cn } from "@/lib/utils";
import type { FichaClinica } from "@/features/pacientes/types/prontuario";

interface FichaClinicaTabProps {
  pacienteId: number;
  fichasClinicas: FichaClinica[];
  onRefresh: () => void;
}

function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function FichaClinicaTab({ pacienteId, fichasClinicas, onRefresh }: FichaClinicaTabProps) {
  const { user } = useAuth();
  const { confirm, dialog } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [fichaParaEditar, setFichaParaEditar] = useState<FichaClinica | undefined>();

  const sorted = [...fichasClinicas].sort((a, b) => b.data.localeCompare(a.data));

  function openNew() {
    setFichaParaEditar(undefined);
    setModalOpen(true);
  }

  function openEdit(ficha: FichaClinica) {
    setFichaParaEditar(ficha);
    setModalOpen(true);
  }

  async function handleDelete(ficha: FichaClinica) {
    if (!user?.token) return;
    const ok = await confirm({
      title: "Excluir entrada",
      description: "Esta entrada da ficha clínica será removida permanentemente.",
      itemName: ficha.observacoesClinicas
        ? ficha.observacoesClinicas.slice(0, 60) + (ficha.observacoesClinicas.length > 60 ? "…" : "")
        : `Entrada de ${ficha.data}`,
    });
    if (!ok) return;
    try {
      await deleteFichaClinica(user.token, pacienteId, ficha.id);
      toast.success("Entrada excluída.");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  return (
    <>
      {dialog}
      <NovaFichaClinicaModal
        open={modalOpen}
        pacienteId={pacienteId}
        fichaParaEditar={fichaParaEditar}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {fichasClinicas.length} entr{fichasClinicas.length !== 1 ? "adas" : "ada"}
          </p>
          <Button size="sm" onClick={openNew} className="h-8 gap-1.5 text-[13px]">
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
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">Data</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">Dente</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">Procedimento</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">Deve</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">Haver</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">Saldo</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-white">
                {sorted.map((f) => (
                  <tr key={f.id} className="group transition-colors hover:bg-muted/10">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground/70">{formatDate(f.data)}</td>
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
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground/70">{formatCurrency(f.deve)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground/70">{formatCurrency(f.haver)}</td>
                    <td className={cn(
                      "px-4 py-3 text-right font-medium tabular-nums",
                      f.saldo !== undefined && f.saldo < 0 ? "text-destructive/80" : "text-foreground/80",
                    )}>
                      {formatCurrency(f.saldo)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-6" onClick={() => openEdit(f)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(f)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
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
