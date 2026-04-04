import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovaAnotacaoModal } from "@/features/pacientes/components/NovaAnotacaoModal";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import { formatDate } from "@/features/pacientes/utils/pacienteHelpers";
import type { Anotacao } from "@/features/pacientes/types/prontuario";

interface AnotacoesTabProps {
  pacienteId: number;
  anotacoes: Anotacao[];
  onRefresh: () => void;
}

export function AnotacoesTab({ pacienteId, anotacoes, onRefresh }: AnotacoesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...anotacoes].sort(
    (a, b) => b.dataAnotacao.localeCompare(a.dataAnotacao),
  );

  return (
    <>
      <NovaAnotacaoModal
        open={modalOpen}
        pacienteId={pacienteId}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {anotacoes.length} anotaç{anotacoes.length !== 1 ? "ões" : "ão"}
          </p>
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-8 gap-1.5 text-[13px]"
          >
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
                className="rounded-xl border border-border/60 bg-white p-4"
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  {formatDate(anotacao.dataAnotacao)}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
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
