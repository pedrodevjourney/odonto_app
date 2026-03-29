import {
  Ellipsis,
  Eye,
  Loader2,
  Pencil,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePageActions } from "@/features/dashboard/contexts/PageActionsContext";
import { usePacientesViewModel } from "@/features/pacientes/viewmodels/usePacientesViewModel";
import type { Paciente } from "@/features/pacientes/types/paciente";
import { cn } from "@/lib/utils";
import { getInitials, formatDate } from "@/features/pacientes/utils/pacienteHelpers";

type RowActionsProps = {
  paciente: Paciente;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function RowActions({
  paciente: _paciente,
  open,
  onToggle,
  onClose,
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
          "flex size-7 items-center justify-center rounded-lg text-muted-foreground/50",
          "transition-all duration-150 hover:bg-muted/60 hover:text-foreground/70",
          open && "bg-muted/60 text-foreground/70",
        )}
      >
        <Ellipsis className="size-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border/50 bg-white shadow-lg shadow-black/5">
          <div className="p-1">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors duration-100 hover:bg-muted/50">
              <Eye className="size-3.5 shrink-0 text-muted-foreground/60" />
              Ver detalhes
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors duration-100 hover:bg-muted/50">
              <Pencil className="size-3.5 shrink-0 text-muted-foreground/60" />
              Editar
            </button>
          </div>
          <div className="mx-3 h-px bg-border/40" />
          <div className="p-1">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive/80 transition-colors duration-100 hover:bg-destructive/5">
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
  const { setActions } = usePageActions();
  const {
    pacientes,
    loading,
    error,
    search,
    setSearch,
    openActionId,
    setOpenActionId,
    retry,
  } = usePacientesViewModel();

  useEffect(() => {
    setActions(
      <Button className="h-9 gap-2 rounded-lg px-5 text-[13px] font-semibold tracking-wide shadow-sm">
        <UserPlus className="size-[15px]" />
        Novo Paciente
      </Button>,
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <div className="h-full overflow-y-auto">
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl text-foreground">Pacientes</h1>
        {!loading && !error && (
          <p className="mt-0.5 text-sm text-muted-foreground/70">
            {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""}{" "}
            cadastrado
            {pacientes.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/40 bg-white shadow-sm shadow-black/4">
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <span className="text-[13px] font-semibold tracking-wide text-foreground/75">
            Lista de Pacientes
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-lg border border-border/70 bg-white pl-9 pr-3 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/45 focus:border-ring/60 focus:ring-2 focus:ring-ring/15"
            />
          </div>
        </div>

        <div className="h-px bg-border/50 mx-0" />

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-5 animate-spin text-muted-foreground/30" />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-sm text-muted-foreground/60">{error}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && pacientes.length === 0 && (
          <div className="flex flex-col items-center gap-1.5 py-24 text-center">
            <p className="text-sm font-medium text-foreground/70">
              Nenhum paciente encontrado
            </p>
            <p className="text-xs text-muted-foreground/50">
              Cadastre o primeiro paciente clicando em "Novo Paciente".
            </p>
          </div>
        )}

        {!loading && !error && pacientes.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/65">
                  Nome
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/65">
                  Telefone
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/65">
                  Nascimento
                </th>
                <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/65">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr
                  key={paciente.id}
                  className={cn(
                    "group transition-colors duration-100 hover:bg-muted/20",
                    index !== 0 && "border-t border-border/20",
                  )}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#a0b6cb]/15 text-[11px] font-semibold text-[#7a9ab5]">
                        {getInitials(paciente.nome)}
                      </div>
                      <span className="text-sm font-medium text-foreground/85">
                        {paciente.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground/60">
                    {paciente.telefone ?? "—"}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground/60">
                    {formatDate(paciente.dataNascimento)}
                  </td>
                  <td className="px-6 py-3.5">
                    <RowActions
                      paciente={paciente}
                      open={openActionId === paciente.id}
                      onToggle={() =>
                        setOpenActionId(
                          openActionId === paciente.id ? null : paciente.id,
                        )
                      }
                      onClose={() => setOpenActionId(null)}
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
  );
}
