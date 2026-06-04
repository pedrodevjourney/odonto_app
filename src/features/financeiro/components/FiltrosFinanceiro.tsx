import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerField } from "@/features/pacientes/components/DatePickerField";
import type { FiltrosLancamento } from "@/features/financeiro/types/lancamento";

interface FiltrosFinanceiroProps {
  filtros: FiltrosLancamento;
  onChange: (filtros: FiltrosLancamento) => void;
}

export function FiltrosFinanceiro({ filtros, onChange }: FiltrosFinanceiroProps) {
  const hasFilters = filtros.dataInicio || filtros.dataFim || filtros.tipo;

  function handleClear() {
    onChange({});
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground/70">
          Data Início
        </label>
        <div className="w-44">
          <DatePickerField
            value={filtros.dataInicio}
            onChange={(val) =>
              onChange({ ...filtros, dataInicio: val })
            }
            placeholder="Selecione"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground/70">
          Data Fim
        </label>
        <div className="w-44">
          <DatePickerField
            value={filtros.dataFim}
            onChange={(val) =>
              onChange({ ...filtros, dataFim: val })
            }
            placeholder="Selecione"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground/70">
          Tipo
        </label>
        <Select
          value={filtros.tipo ?? "TODOS"}
          onValueChange={(val) =>
            onChange({
              ...filtros,
              tipo: val === "TODOS" ? undefined : (val as "RECEITA" | "DESPESA"),
            })
          }
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="RECEITA">Receita</SelectItem>
            <SelectItem value="DESPESA">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="invisible text-[12px] font-medium">_</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => onChange({ ...filtros })}
          >
            <Search className="size-3.5" />
            Filtrar
          </Button>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 text-muted-foreground"
              onClick={handleClear}
            >
              <X className="size-3.5" />
              Limpar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
