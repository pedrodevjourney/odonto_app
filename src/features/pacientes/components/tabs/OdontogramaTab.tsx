import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { salvarDadosDente } from "@/features/pacientes/services/prontuarioService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { DadosDente, StatusDente } from "@/features/pacientes/types/prontuario";

interface OdontogramaTabProps {
  pacienteId: number;
  dadosDentes: DadosDente[];
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<StatusDente, { label: string; bg: string; text: string; border: string }> = {
  SADIO:      { label: "Sadio",      bg: "bg-white",       text: "text-foreground/60",  border: "border-border/50"  },
  CARIADO:    { label: "Cariado",    bg: "bg-red-100",     text: "text-red-700",        border: "border-red-300"    },
  RESTAURADO: { label: "Restaurado", bg: "bg-blue-100",    text: "text-blue-700",       border: "border-blue-300"   },
  EXTRAIDO:   { label: "Extraído",   bg: "bg-zinc-200",    text: "text-zinc-500",       border: "border-zinc-400"   },
  IMPLANTE:   { label: "Implante",   bg: "bg-violet-100",  text: "text-violet-700",     border: "border-violet-300" },
  AUSENTE:    { label: "Ausente",    bg: "bg-zinc-100",    text: "text-zinc-400",       border: "border-zinc-300 border-dashed" },
};

const QUADRANTES: { label: string; dentes: number[] }[] = [
  { label: "Superior direito", dentes: [18, 17, 16, 15, 14, 13, 12, 11] },
  { label: "Superior esquerdo", dentes: [21, 22, 23, 24, 25, 26, 27, 28] },
  { label: "Inferior esquerdo", dentes: [31, 32, 33, 34, 35, 36, 37, 38] },
  { label: "Inferior direito", dentes: [48, 47, 46, 45, 44, 43, 42, 41] },
];

export function OdontogramaTab({ pacienteId, dadosDentes, onRefresh }: OdontogramaTabProps) {
  const { user } = useAuth();
  const [denteSelecionado, setDenteSelecionado] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusDente>("SADIO");
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);

  const statusMap = new Map<number, DadosDente>(dadosDentes.map((d) => [d.numeroDente, d]));

  function getDenteStatus(numero: number): StatusDente {
    return statusMap.get(numero)?.status ?? "SADIO";
  }

  function openDente(numero: number) {
    const dados = statusMap.get(numero);
    setDenteSelecionado(numero);
    setStatus(dados?.status ?? "SADIO");
    setObservacoes(dados?.observacoes ?? "");
  }

  async function salvar() {
    if (!user?.token || denteSelecionado === null) return;
    setSaving(true);
    try {
      await salvarDadosDente(user.token, pacienteId, {
        numeroDente: denteSelecionado,
        status,
        observacoes: observacoes || undefined,
      });
      toast.success(`Dente ${denteSelecionado} atualizado.`);
      onRefresh();
      setDenteSelecionado(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const alterados = dadosDentes.filter((d) => d.status && d.status !== "SADIO").length;

  return (
    <>
      <Dialog open={denteSelecionado !== null} onOpenChange={(v) => !v && setDenteSelecionado(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Dente {denteSelecionado}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as StatusDente)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Textarea
                placeholder="Detalhes adicionais..."
                rows={3}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDenteSelecionado(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={salvar} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/60">
            {alterados} dente{alterados !== 1 ? "s" : ""} com registro
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn("size-3 rounded border", cfg.bg, cfg.border)} />
                <span className="text-[11px] text-muted-foreground/70">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 overflow-x-auto">
          <div className="grid grid-cols-2 gap-1 min-w-[560px]">
            {QUADRANTES.slice(0, 2).map((q) => (
              <div key={q.label} className="space-y-1">
                <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/40 pb-1">
                  {q.label}
                </p>
                <div className={cn("flex gap-1", q.label.includes("esquerdo") ? "justify-start" : "justify-end")}>
                  {q.dentes.map((n) => {
                    const st = getDenteStatus(n);
                    const cfg = STATUS_CONFIG[st];
                    return (
                      <button
                        key={n}
                        onClick={() => openDente(n)}
                        title={`Dente ${n} — ${cfg.label}`}
                        className={cn(
                          "flex w-10 flex-col items-center gap-0.5 rounded-lg border px-1 py-2 transition-all hover:scale-105 hover:shadow-sm",
                          cfg.bg, cfg.border,
                        )}
                      >
                        <ToothSvg status={st} />
                        <span className={cn("text-[10px] font-semibold tabular-nums", cfg.text)}>{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-border/40 my-2" />

          <div className="grid grid-cols-2 gap-1 min-w-[560px]">
            {QUADRANTES.slice(2, 4).map((q) => (
              <div key={q.label} className="space-y-1">
                <div className={cn("flex gap-1", q.label.includes("esquerdo") ? "justify-start" : "justify-end")}>
                  {q.dentes.map((n) => {
                    const st = getDenteStatus(n);
                    const cfg = STATUS_CONFIG[st];
                    return (
                      <button
                        key={n}
                        onClick={() => openDente(n)}
                        title={`Dente ${n} — ${cfg.label}`}
                        className={cn(
                          "flex w-10 flex-col items-center gap-0.5 rounded-lg border px-1 py-2 transition-all hover:scale-105 hover:shadow-sm",
                          cfg.bg, cfg.border,
                        )}
                      >
                        <span className={cn("text-[10px] font-semibold tabular-nums", cfg.text)}>{n}</span>
                        <ToothSvg status={st} flipped />
                      </button>
                    );
                  })}
                </div>
                <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/40 pt-1">
                  {q.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ToothSvg({ status, flipped = false }: { status: StatusDente; flipped?: boolean }) {
  const colorMap: Record<StatusDente, string> = {
    SADIO:      "#e2e8f0",
    CARIADO:    "#fca5a5",
    RESTAURADO: "#93c5fd",
    EXTRAIDO:   "#9ca3af",
    IMPLANTE:   "#c4b5fd",
    AUSENTE:    "#f1f5f9",
  };

  const fill = colorMap[status];
  const isExtraido = status === "EXTRAIDO";

  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flipped ? "scaleY(-1)" : undefined }}
    >
      <path
        d="M10 2C7 2 4 4 3 7C2.5 9 3 11 3.5 13C4 15 4 17 4 19C4 21 5 22 6 22C7 22 7.5 21 7.5 19.5C7.5 18 8 17 10 17C12 17 12.5 18 12.5 19.5C12.5 21 13 22 14 22C15 22 16 21 16 19C16 17 16 15 16.5 13C17 11 17.5 9 17 7C16 4 13 2 10 2Z"
        fill={fill}
        stroke={isExtraido ? "#6b7280" : "currentColor"}
        strokeWidth="1"
        strokeOpacity="0.2"
      />
      {isExtraido && (
        <>
          <line x1="7" y1="9" x2="13" y2="15" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="9" x2="7" y2="15" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
