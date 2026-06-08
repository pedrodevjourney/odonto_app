import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Paciente } from "@/features/pacientes/types/paciente";

interface PatientComboboxProps {
  patients: Paciente[];
  value: number | undefined;
  onChange: (id: number) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PatientCombobox({
  patients,
  value,
  onChange,
  loading,
  disabled,
}: PatientComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = patients.find((p) => p.id === value);
  const trimmed = query.trim();

  const filtered = trimmed
    ? patients.filter((p) =>
        p.nome.toLowerCase().includes(trimmed.toLowerCase()),
      )
    : patients;

  function handleFocus() {
    setQuery("");
    setOpen(true);
  }

  function handleBlur() {
    setTimeout(() => setOpen(false), 150);
  }

  function handleSelect(patient: Paciente) {
    onChange(patient.id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        placeholder={loading ? "Carregando pacientes..." : "Buscar paciente pelo nome..."}
        value={open ? query : (selected?.nome ?? "")}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled || loading}
      />

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {filtered.length === 0 ? (
            <div className="px-3 py-3 text-center text-sm text-muted-foreground">
              Nenhum paciente encontrado.
              <br />
              <span className="text-xs">
                Marque "Paciente não cadastrado" para agendar sem cadastro.
              </span>
            </div>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onMouseDown={() => handleSelect(p)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span className="size-3.5 shrink-0">
                  {value === p.id && <Check className="size-3.5" />}
                </span>
                <span className="flex-1 truncate">{p.nome}</span>
                {p.prospecto && (
                  <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                    Novo cliente
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
