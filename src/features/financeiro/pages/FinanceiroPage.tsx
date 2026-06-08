import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinanceiroViewModel } from "@/features/financeiro/viewmodels/useFinanceiroViewModel";
import { ResumoCards } from "@/features/financeiro/components/ResumoCards";
import { FiltrosFinanceiro } from "@/features/financeiro/components/FiltrosFinanceiro";
import { LancamentoModal } from "@/features/financeiro/components/LancamentoModal";
import { ExcluirLancamentoDialog } from "@/features/financeiro/components/ExcluirLancamentoDialog";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { formatDate } from "@/features/pacientes/utils/pacienteHelpers";
import { cn } from "@/lib/utils";
import type { LancamentoResponse } from "@/features/financeiro/types/lancamento";

export function FinanceiroPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const pacienteId = Number(id);

  const backTo: string = location.state?.backTo ?? "/dashboard/pagamentos";
  const backLabel: string = location.state?.backLabel ?? "Pagamentos";

  const {
    lancamentos,
    resumo,
    loading,
    error,
    filtros,
    setFiltros,
    refresh,
    handleExcluir,
  } = useFinanceiroViewModel(pacienteId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLancamento, setEditingLancamento] =
    useState<LancamentoResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LancamentoResponse | null>(
    null,
  );

  function handleOpenNew() {
    setEditingLancamento(null);
    setModalOpen(true);
  }

  function handleEdit(lancamento: LancamentoResponse) {
    setEditingLancamento(lancamento);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingLancamento(null);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backTo)}
              className="h-8 gap-1.5 px-2 text-[13px] text-muted-foreground/60 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {backLabel}
            </Button>
            {!loading && resumo && (
              <>
                <span className="text-muted-foreground/40">/</span>
                <span className="truncate text-[13px] font-medium text-foreground/70">
                  Financeiro — {resumo.pacienteNome}
                </span>
              </>
            )}
          </div>
          <Button size="sm" className="gap-1.5" onClick={handleOpenNew}>
            <Plus className="size-4" />
            Novo Lançamento
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-5 animate-spin text-muted-foreground/30" />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-32 text-center">
            <p className="text-sm text-muted-foreground/60">{error}</p>
            <Button variant="outline" size="sm" onClick={refresh}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && resumo && (
          <>
            <ResumoCards resumo={resumo} />

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm shadow-black/5">
              <FiltrosFinanceiro filtros={filtros} onChange={setFiltros} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-black/5">
              {lancamentos.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Receipt className="size-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground/70">
                    Nenhum lançamento encontrado
                  </p>
                  <p className="text-[13px] text-muted-foreground/60">
                    Clique em "Novo Lançamento" para começar.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Data
                        </th>
                        <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Descrição
                        </th>
                        <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Tipo
                        </th>
                        <th className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Valor Total
                        </th>
                        <th className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Valor Pago
                        </th>
                        <th className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Valor Restante
                        </th>
                        <th className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lancamentos.map((l) => (
                        <tr
                          key={l.id}
                          className="border-b border-border/40 transition-colors hover:bg-muted/20"
                        >
                          <td className="whitespace-nowrap px-5 py-3 tabular-nums text-foreground/80">
                            {formatDate(l.data)}
                          </td>
                          <td className="px-5 py-3 font-medium text-foreground">
                            {l.descricao}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                                l.tipo === "RECEITA"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700",
                              )}
                            >
                              {l.tipo === "RECEITA" ? "Receita" : "Despesa"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-foreground/80">
                            {l.valorTotal != null ? formatBRL(l.valorTotal) : "—"}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-emerald-600">
                            {l.valorPago != null ? formatBRL(l.valorPago) : "—"}
                          </td>
                          <td
                            className={cn(
                              "whitespace-nowrap px-5 py-3 text-right font-semibold tabular-nums",
                              l.valorRestante <= 0
                                ? "text-emerald-600"
                                : "text-red-600",
                            )}
                          >
                            {formatBRL(l.valorRestante)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => handleEdit(l)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => setDeleteTarget(l)}
                              >
                                <Trash2 className="size-3.5" />
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
        )}
      </div>

      <LancamentoModal
        open={modalOpen}
        pacienteId={pacienteId}
        lancamento={editingLancamento}
        onClose={handleCloseModal}
        onSuccess={refresh}
      />

      <ExcluirLancamentoDialog
        open={!!deleteTarget}
        descricao={deleteTarget?.descricao}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await handleExcluir(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
