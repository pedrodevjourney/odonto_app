import { FileText, ClipboardList, ClipboardCheck, Image, History, Calendar, DollarSign } from "lucide-react";
import { EmptyState } from "@/features/pacientes/components/EmptyState";
import { cn } from "@/lib/utils";
import type { HistoricoItem, TipoHistorico } from "@/features/pacientes/types/prontuario";

interface HistoricoTabProps {
  itens: HistoricoItem[];
}

const TIPO_CONFIG: Record<TipoHistorico, {
  label: string;
  Icon: React.ElementType;
  dot: string;
  bg: string;
}> = {
  ANOTACAO:         { label: "Anotação",         Icon: FileText,       dot: "bg-amber-400",   bg: "bg-amber-50"   },
  FICHA_CLINICA:    { label: "Ficha Clínica",    Icon: ClipboardList,  dot: "bg-blue-400",    bg: "bg-blue-50"    },
  PLANO_TRATAMENTO: { label: "Plano de Trat.",   Icon: ClipboardCheck, dot: "bg-violet-400",  bg: "bg-violet-50"  },
  RADIOGRAFIA:      { label: "Radiografia",      Icon: Image,          dot: "bg-slate-400",   bg: "bg-slate-50"   },
  CONSULTA:         { label: "Consulta",         Icon: Calendar,       dot: "bg-emerald-400", bg: "bg-emerald-50" },
  LANCAMENTO:       { label: "Financeiro",       Icon: DollarSign,     dot: "bg-rose-400",    bg: "bg-rose-50"    },
};

function formatarData(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function agruparPorMes(itens: HistoricoItem[]) {
  const grupos = new Map<string, HistoricoItem[]>();
  for (const item of itens) {
    const [ano, mes] = item.data.split("-");
    const chave = `${ano}-${mes}`;
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave)!.push(item);
  }
  return Array.from(grupos.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatarMes(chaveMes: string) {
  const [ano, mes] = chaveMes.split("-");
  return new Date(Number(ano), Number(mes) - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function HistoricoTab({ itens }: HistoricoTabProps) {
  if (itens.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Nenhum histórico registrado"
        description="O histórico será preenchido conforme o paciente for atendido."
      />
    );
  }

  const grupos = agruparPorMes(itens);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground/60">{itens.length} evento{itens.length !== 1 ? "s" : ""}</p>
      {grupos.map(([chave, itensMes]) => (
        <div key={chave} className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 capitalize">
            {formatarMes(chave)}
          </h3>
          <div className="relative space-y-2 pl-5">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border/60" />
            {itensMes.map((item) => {
              const cfg = TIPO_CONFIG[item.tipo];
              const Icon = cfg.Icon;
              return (
                <div key={`${item.tipo}-${item.id}`} className="relative flex gap-3">
                  <div className={cn("absolute -left-5 top-3 size-2.5 rounded-full border-2 border-background", cfg.dot)} />
                  <div className={cn("flex-1 rounded-xl border border-border/60 p-3.5", cfg.bg)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="size-3.5 shrink-0 text-foreground/50 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
                            {cfg.label}
                          </p>
                          <p className="font-medium text-sm text-foreground/85 leading-snug">{item.titulo}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground/50 whitespace-nowrap">
                        {formatarData(item.data)}
                      </span>
                    </div>
                    {item.descricao && (
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/60 line-clamp-3">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
