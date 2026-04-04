import { useState } from "react";
import { Plus, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovoDadosDenteModal } from "@/features/pacientes/components/NovoDadosDenteModal";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import type { DadosDente } from "@/features/pacientes/types/prontuario";

interface DentesTabProps {
  pacienteId: number;
  dadosDentes: DadosDente[];
  onRefresh: () => void;
}

export function DentesTab({ pacienteId, dadosDentes, onRefresh }: DentesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...dadosDentes].sort((a, b) => a.numeroDente - b.numeroDente);

  return (
    <>
      <NovoDadosDenteModal
        open={modalOpen}
        pacienteId={pacienteId}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {dadosDentes.length} dente{dadosDentes.length !== 1 ? "s" : ""} registrado{dadosDentes.length !== 1 ? "s" : ""}
          </p>
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="h-8 gap-1.5 text-[13px]"
          >
            <Plus className="size-3.5" />
            Novo Dente
          </Button>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={Smile}
            title="Nenhum dado de dente registrado"
            description="Registre informações dos dentes avaliados."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/35">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Dente
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Cor
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Escurecimento
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Forma
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                    Observações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-white">
                {sorted.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
                        {d.numeroDente}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">
                      {d.cor ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">
                      {d.escurecimento ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">
                      {d.forma ?? "—"}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground/70">
                      {d.observacoes ?? "—"}
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
