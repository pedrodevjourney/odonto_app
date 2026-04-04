import {
  Ellipsis,
  Eye,
  Loader2,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageActions } from "@/features/dashboard/contexts/PageActionsContext";
import { usePacientesViewModel } from "@/features/pacientes/viewmodels/usePacientesViewModel";
import { CadastroPacienteModal } from "@/features/pacientes/components/CadastroPacienteModal";
import { ExcluirPacienteDialog } from "@/features/pacientes/components/ExcluirPacienteDialog";
import type { Paciente } from "@/features/pacientes/types/paciente";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/pacientes/utils/pacienteHelpers";

type RowActionsProps = {
  paciente: Paciente;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onDeleteClick: (paciente: Paciente) => void;
  onViewClick: (paciente: Paciente) => void;
};

function RowActions({
  paciente,
  open,
  onToggle,
  onClose,
  onDeleteClick,
  onViewClick,
}: RowActionsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={onToggle}
        aria-label="Ações"
        className={cn(
          "flex size-7 items-center justify-center rounded-md text-muted-foreground/40",
          "transition-all duration-150 hover:bg-muted hover:text-foreground/60",
          open && "bg-muted text-foreground/60",
        )}
      >
        <Ellipsis className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-border/70 bg-white shadow-lg shadow-black/8">
          <div className="p-1">
            <button
              onClick={() => { onClose(); onViewClick(paciente); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/75 transition-colors hover:bg-muted/60"
            >
              <Eye className="size-3.5 shrink-0 text-muted-foreground/50" />
              Ver prontuário
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/75 transition-colors hover:bg-muted/60">
              <Pencil className="size-3.5 shrink-0 text-muted-foreground/50" />
              Editar
            </button>
          </div>
          <div className="mx-2 h-px bg-border/60" />
          <div className="p-1">
            <button
              onClick={() => { onClose(); onDeleteClick(paciente); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive/80 transition-colors hover:bg-destructive/8 hover:text-destructive"
            >
              <Trash2 className="size-3.5 shrink-0" />
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PacientesPage() {
  const navigate = useNavigate();
  const { setActions } = usePageActions();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Paciente | null>(null);
  const {
    pacientes,
    loading,
    error,
    search,
    setSearch,
    openActionId,
    setOpenActionId,
    retry,
    refresh,
    handleExcluir,
  } = usePacientesViewModel();

  useEffect(() => {
    setActions(
      <Button
        onClick={() => setModalOpen(true)}
        className="h-9 gap-2 rounded-lg px-5 text-[13px] font-semibold tracking-wide shadow-sm"
      >
        <UserPlus className="size-[15px]" />
        Novo Paciente
      </Button>,
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <>
      <CadastroPacienteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); refresh(); }}
      />
      <ExcluirPacienteDialog
        open={deleteTarget !== null}
        pacienteNome={deleteTarget?.nome}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await handleExcluir(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />

      <div className="h-full overflow-y-auto">
        <div className="space-y-6">

          {/* Page header */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-foreground">
                Pacientes
              </h1>
              {!loading && !error && (
                <p className="mt-0.5 text-sm text-muted-foreground/65">
                  {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} cadastrado{pacientes.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Main card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-black/5">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <span className="text-[13px] font-semibold tracking-wide text-foreground/70">
                Lista de Pacientes
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-muted-foreground/45" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-60 rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-ring/60 focus:ring-2 focus:ring-ring/15"
                />
              </div>
            </div>

            <div className="h-px bg-border/60" />

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-28">
                <Loader2 className="size-5 animate-spin text-muted-foreground/30" />
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center gap-3 py-28 text-center">
                <p className="text-sm text-muted-foreground/60">{error}</p>
                <Button variant="outline" size="sm" onClick={retry}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && pacientes.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-28 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted/60">
                  <Users className="size-5 text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground/70">
                    Nenhum paciente encontrado
                  </p>
                  <p className="text-xs text-muted-foreground/50">
                    {search
                      ? "Tente buscar por outro nome."
                      : "Cadastre o primeiro paciente clicando em \"Novo Paciente\"."}
                  </p>
                </div>
              </div>
            )}

            {/* Table */}
            {!loading && !error && pacientes.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/35">
                    <th className="w-14 px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                      Nº
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/55">
                      Nascimento
                    </th>
                    <th className="w-16 px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {pacientes.map((paciente) => (
                    <tr
                      key={paciente.id}
                      onClick={() => navigate(`/dashboard/pacientes/${paciente.id}`)}
                      className="group cursor-pointer transition-colors duration-100 hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium tabular-nums text-muted-foreground/50">
                          {paciente.numero ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground/85">
                            {paciente.nome}
                          </p>
                          {paciente.profissao && (
                            <p className="text-xs text-muted-foreground/50">
                              {paciente.profissao}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground/60">
                        {paciente.telefone ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground/60">
                        {formatDate(paciente.dataNascimento)}
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RowActions
                          paciente={paciente}
                          open={openActionId === paciente.id}
                          onToggle={() =>
                            setOpenActionId(
                              openActionId === paciente.id ? null : paciente.id,
                            )
                          }
                          onClose={() => setOpenActionId(null)}
                          onDeleteClick={setDeleteTarget}
                          onViewClick={(p) => navigate(`/dashboard/pacientes/${p.id}`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
