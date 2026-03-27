import { Ellipsis, Eye, Loader2, Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePageActions } from "@/contexts/PageActionsContext";
import { useAuth } from "@/contexts/AuthContext";
import { listarPacientes } from "@/services/pacienteService";
import type { Paciente, PacientePage } from "@/types/paciente";
import { cn } from "@/lib/utils";

function getInitials(nome: string): string {
  const parts = nome.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
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
          "flex size-8 items-center justify-center rounded-md text-muted-foreground",
          "transition-colors duration-150 hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
      >
        <Ellipsis className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-md">
          <button className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground transition-colors duration-150 hover:bg-muted">
            <Eye className="size-4 shrink-0 text-muted-foreground" />
            Ver detalhes
          </button>
          <button className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground transition-colors duration-150 hover:bg-muted">
            <Pencil className="size-4 shrink-0 text-muted-foreground" />
            Editar
          </button>
          <div className="my-1 h-px bg-border" />
          <button className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-destructive transition-colors duration-150 hover:bg-destructive/5">
            <Trash2 className="size-4 shrink-0" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}

export function PacientesPage() {
  const { user } = useAuth();
  const { setActions } = usePageActions();

  const [pageData, setPageData] = useState<PacientePage | null>(null);
  const pacientes = pageData?.content ?? [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPacientes = useCallback(async (nome?: string) => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listarPacientes(user.token, { nome });
      setPageData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar pacientes.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchPacientes(debouncedSearch || undefined);
  }, [fetchPacientes, debouncedSearch]);

  useEffect(() => {
    setActions(
      <Button className="gap-2 px-4 py-2">
        <UserPlus className="size-4" />
        Novo Paciente
      </Button>,
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl text-foreground">Pacientes</h1>
        {!loading && !error && (
          <p className="mt-1 text-sm text-muted-foreground">
            {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""}{" "}
            cadastrado
            {pacientes.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Lista de Pacientes
          </span>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchPacientes(debouncedSearch || undefined)}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && pacientes.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <p className="text-sm font-medium text-foreground">
              Nenhum paciente encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Cadastre o primeiro paciente clicando em "Novo Paciente".
            </p>
          </div>
        )}

        {!loading && !error && pacientes.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nome Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nascimento
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pacientes.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="transition-colors duration-100 hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-foreground/70">
                        {getInitials(paciente.nome)}
                      </div>
                      <span className="font-medium text-foreground">
                        {paciente.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {paciente.telefone ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {formatDate(paciente.dataNascimento)}
                  </td>
                  <td className="px-6 py-4">
                    <RowActions
                      paciente={paciente}
                      open={openActionId === paciente.id}
                      onToggle={() =>
                        setOpenActionId((id) =>
                          id === paciente.id ? null : paciente.id,
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
  );
}
