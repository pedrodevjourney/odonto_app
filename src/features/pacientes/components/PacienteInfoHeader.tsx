import {
  Phone,
  Briefcase,
  CalendarDays,
  MapPin,
  Heart,
  UserRound,
  Stethoscope,
  Hash,
} from "lucide-react";
import type { Paciente } from "@/features/pacientes/types/paciente";
import { maskPhone, formatDate, calcularIdade } from "@/features/pacientes/utils/pacienteHelpers";

interface PacienteInfoHeaderProps {
  paciente: Paciente;
}

const ESTADO_CIVIL_LABELS: Record<string, string> = {
  SOLTEIRO: "Solteiro(a)",
  CASADO: "Casado(a)",
  DIVORCIADO: "Divorciado(a)",
  VIUVO: "Viúvo(a)",
  UNIAO_ESTAVEL: "União Estável",
};


function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground/90">{value}</p>
      </div>
    </div>
  );
}

export function PacienteInfoHeader({ paciente }: PacienteInfoHeaderProps) {
  const idade = calcularIdade(paciente.dataNascimento);
  const nascimento = paciente.dataNascimento
    ? `${formatDate(paciente.dataNascimento)}${idade ? `  ·  ${idade}` : ""}`
    : null;
  const endereco =
    paciente.enderecoCompleto ??
    (paciente.residencia ? paciente.residencia : null);
  const telefoneSecundario = paciente.telefoneSecundario
    ? maskPhone(paciente.telefoneSecundario)
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-black/5">
      {/* Top band */}
      <div className="flex items-center gap-5 border-b border-border/50 px-6 py-5">
        {/* Icon circle — no abbreviation */}
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <UserRound className="size-7 text-primary" strokeWidth={1.5} />
        </div>

        {/* Name + number + status */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-semibold leading-tight text-foreground">
              {paciente.nome}
            </h2>
            {paciente.numero && (
              <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground/55">
                <Hash className="size-2.5" />
                {paciente.numero}
              </span>
            )}
            {paciente.dlne && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600/80">
                DLNE
              </span>
            )}
          </div>

          {/* Primary info row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {paciente.telefone && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <Phone className="size-3.5 shrink-0 text-primary" />
                {maskPhone(paciente.telefone)}
              </span>
            )}
            {paciente.profissao && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <Briefcase className="size-3.5 shrink-0 text-primary" />
                {paciente.profissao}
              </span>
            )}
            {nascimento && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <CalendarDays className="size-3.5 shrink-0 text-primary" />
                {nascimento}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detail grid */}
      {(paciente.estadoCivil ||
        telefoneSecundario ||
        endereco ||
        paciente.nacionalidade ||
        paciente.indicadoPor ||
        paciente.inicioTratamento) && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 bg-muted/30 px-6 py-5 sm:grid-cols-3 lg:grid-cols-4">
          <InfoItem
            icon={Heart}
            label="Estado Civil"
            value={
              paciente.estadoCivil
                ? ESTADO_CIVIL_LABELS[paciente.estadoCivil]
                : null
            }
          />
          <InfoItem
            icon={Phone}
            label="Telefone Secundário"
            value={telefoneSecundario}
          />
          <InfoItem
            icon={MapPin}
            label="Endereço"
            value={endereco}
          />
          <InfoItem
            icon={UserRound}
            label="Nacionalidade"
            value={paciente.nacionalidade}
          />
          <InfoItem
            icon={UserRound}
            label="Indicado por"
            value={paciente.indicadoPor}
          />
          <InfoItem
            icon={Stethoscope}
            label="Início do tratamento"
            value={
              paciente.inicioTratamento
                ? formatDate(paciente.inicioTratamento)
                : null
            }
          />
          <InfoItem
            icon={Stethoscope}
            label="Término do tratamento"
            value={
              paciente.terminoTratamento
                ? formatDate(paciente.terminoTratamento)
                : null
            }
          />
          <InfoItem
            icon={Stethoscope}
            label="Interrupção"
            value={
              paciente.interrupcaoTratamento
                ? formatDate(paciente.interrupcaoTratamento)
                : null
            }
          />
        </div>
      )}
    </div>
  );
}
