import { useState } from "react";
import { Plus, ClipboardCheck, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import { ItemPlanoModal } from "@/features/pacientes/components/ItemPlanoModal";
import { deleteItemPlano } from "@/features/pacientes/services/prontuarioService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useConfirm } from "@/hooks/useConfirm";
import { cn } from "@/lib/utils";
import type { PlanoTratamento, StatusTratamento } from "@/features/pacientes/types/prontuario";

interface PlanoTratamentoTabProps {
  pacienteId: number;
  itens: PlanoTratamento[];
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<StatusTratamento, { label: string; className: string }> = {
  PENDENTE: { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200" },
  EM_ANDAMENTO: { label: "Em andamento", className: "bg-blue-50 text-blue-700 border-blue-200" },
  CONCLUIDO: { label: "Concluído", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELADO: { label: "Cancelado", className: "bg-red-50 text-red-500 border-red-200" },
};

export function PlanoTratamentoTab({ pacienteId, itens, onRefresh }: PlanoTratamentoTabProps) {
  const { user } = useAuth();
  const { confirm, dialog } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<PlanoTratamento | undefined>();

  const concluidos = itens.filter((i) => i.status === "CONCLUIDO").length;
  const total = itens.length;

  async function handleDelete(item: PlanoTratamento) {
    if (!user?.token) return;
    const ok = await confirm({
      title: "Remover procedimento",
      description: "O procedimento será removido do plano de tratamento permanentemente.",
      itemName: item.procedimento,
    });
    if (!ok) return;
    try {
      await deleteItemPlano(user.token, pacienteId, item.id);
      toast.success("Procedimento removido.");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover.");
    }
  }

  function openEdit(item: PlanoTratamento) {
    setItemParaEditar(item);
    setModalOpen(true);
  }

  function openNew() {
    setItemParaEditar(undefined);
    setModalOpen(true);
  }

  return (
    <>
      {dialog}
      <ItemPlanoModal
        open={modalOpen}
        pacienteId={pacienteId}
        itemParaEditar={itemParaEditar}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground/60">
              {total} procedimento{total !== 1 ? "s" : ""}
            </p>
            {total > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${total > 0 ? (concluidos / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground/50">
                  {concluidos}/{total}
                </span>
              </div>
            )}
          </div>
          <Button size="sm" onClick={openNew} className="h-8 gap-1.5 text-[13px]">
            <Plus className="size-3.5" />
            Novo Procedimento
          </Button>
        </div>

        {itens.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="Nenhum procedimento planejado"
            description="Adicione procedimentos ao plano de tratamento do paciente."
          />
        ) : (
          <div className="space-y-2">
            {itens.map((item) => {
              const { label, className } = STATUS_CONFIG[item.status];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-foreground/90">{item.procedimento}</p>
                      {item.numeroDente && (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          Dente {item.numeroDente}
                        </span>
                      )}
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", className)}>
                        {label}
                      </span>
                    </div>
                    {item.observacoes && (
                      <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed">{item.observacoes}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground/50">
                      {item.dataPrevista && <span>Previsto: {item.dataPrevista}</span>}
                      {item.valor && (
                        <span>
                          R${" "}
                          {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
