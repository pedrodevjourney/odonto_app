import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, DollarSign, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { listarPacientes } from "@/features/pacientes/services/pacienteService";
import type { Paciente } from "@/features/pacientes/types/paciente";

export function PagamentosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPacientes = useCallback(
    async (nome?: string) => {
      if (!user?.token) return;
      setLoading(true);
      setError(null);
      try {
        const result = await listarPacientes(user.token, { nome });
        setPacientes(result.content);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar pacientes.",
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.token],
  );

  useEffect(() => {
    fetchPacientes(debouncedSearch || undefined);
  }, [fetchPacientes, debouncedSearch]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-foreground">
              Pagamentos
            </h1>
            {!loading && !error && (
              <p className="mt-0.5 text-sm text-muted-foreground/65">
                Selecione um paciente para acessar o financeiro.
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
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/45" />
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPacientes(debouncedSearch || undefined)}
              >
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
                    : "Cadastre pacientes para gerenciar pagamentos."}
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && pacientes.length > 0 && (
            <div className="divide-y divide-border/30">
              {pacientes.map((paciente) => (
                <button
                  key={paciente.id}
                  onClick={() =>
                    navigate(`/dashboard/pacientes/${paciente.id}/financeiro`)
                  }
                  className="group flex w-full items-center gap-4 px-6 py-3.5 text-left transition-colors duration-100 hover:bg-muted/20"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <DollarSign className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground/85">
                      {paciente.nome}
                    </p>
                    {paciente.profissao && (
                      <p className="truncate text-xs text-muted-foreground/50">
                        {paciente.profissao}
                      </p>
                    )}
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground/40">
                    Nº {paciente.numero ?? "—"}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-foreground/50" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
