import { useState } from "react";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NovaAnotacaoModal } from "@/features/pacientes/components/NovaAnotacaoModal";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import { deleteAnotacao } from "@/features/pacientes/services/prontuarioService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useConfirm } from "@/hooks/useConfirm";
import { formatDate } from "@/features/pacientes/utils/pacienteHelpers";
import type { Anotacao } from "@/features/pacientes/types/prontuario";

interface AnotacoesTabProps {
  pacienteId: number;
  anotacoes: Anotacao[];
  onRefresh: () => void;
}

export function AnotacoesTab({ pacienteId, anotacoes, onRefresh }: AnotacoesTabProps) {
  const { user } = useAuth();
  const { confirm, dialog } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [anotacaoParaEditar, setAnotacaoParaEditar] = useState<Anotacao | undefined>();

  const sorted = [...anotacoes].sort((a, b) => b.dataAnotacao.localeCompare(a.dataAnotacao));

  function openNew() {
    setAnotacaoParaEditar(undefined);
    setModalOpen(true);
  }

  function openEdit(anotacao: Anotacao) {
    setAnotacaoParaEditar(anotacao);
    setModalOpen(true);
  }

  async function handleDelete(anotacao: Anotacao) {
    if (!user?.token) return;
    const ok = await confirm({
      title: "Excluir anotação",
      description: "A anotação será removida permanentemente.",
      itemName: anotacao.conteudo.slice(0, 80) + (anotacao.conteudo.length > 80 ? "…" : ""),
    });
    if (!ok) return;
    try {
      await deleteAnotacao(user.token, pacienteId, anotacao.id);
      toast.success("Anotação excluída.");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  return (
    <>
      {dialog}
      <NovaAnotacaoModal
        open={modalOpen}
        pacienteId={pacienteId}
        anotacaoParaEditar={anotacaoParaEditar}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {anotacoes.length} anotaç{anotacoes.length !== 1 ? "ões" : "ão"}
          </p>
          <Button size="sm" onClick={openNew} className="h-8 gap-1.5 text-[13px]">
            <Plus className="size-3.5" />
            Nova Anotação
          </Button>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma anotação registrada"
            description="Adicione a primeira anotação clínica do paciente."
          />
        ) : (
          <div className="space-y-3">
            {sorted.map((anotacao) => (
              <div
                key={anotacao.id}
                className="group rounded-xl border border-border/60 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    {formatDate(anotacao.dataAnotacao)}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => openEdit(anotacao)}
                    >
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(anotacao)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                  {anotacao.conteudo}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
