import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProntuarioViewModel } from "@/features/pacientes/viewmodels/useProntuarioViewModel";
import { PacienteInfoHeader } from "@/features/pacientes/components/PacienteInfoHeader";
import { AnotacoesTab } from "@/features/pacientes/components/tabs/AnotacoesTab";
import { DentesTab } from "@/features/pacientes/components/tabs/DentesTab";
import { FichaClinicaTab } from "@/features/pacientes/components/tabs/FichaClinicaTab";
import { cn } from "@/lib/utils";

type Tab = "anotacoes" | "dentes" | "ficha";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5.5c-1.5-2-3.5-3-5-2C4.5 4.5 3 7 3 9c0 2 .5 3.5 1.5 5C5.5 15.5 6 17 6 19c0 1 .5 2 1.5 2S9 20 9 19c0-1 .5-2 1.5-2s1.5 1 1.5 2-.5 2-1.5 2" />
      <path d="M12 5.5c1.5-2 3.5-3 5-2 2.5 1 4 3.5 4 5.5 0 2-.5 3.5-1.5 5C18.5 15.5 18 17 18 19c0 1-.5 2-1.5 2S15 20 15 19c0-1-.5-2-1.5-2" />
    </svg>
  );
}

export function ProntuarioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pacienteId = Number(id);
  const [activeTab, setActiveTab] = useState<Tab>("anotacoes");

  const {
    paciente,
    dadosDentes,
    anotacoes,
    fichasClinicas,
    loading,
    error,
    refreshDadosDentes,
    refreshAnotacoes,
    refreshFichasClinicas,
  } = useProntuarioViewModel(pacienteId);

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    count: number;
  }[] = [
    { id: "anotacoes", label: "Anotações",    icon: FileText,     count: anotacoes.length },
    { id: "dentes",    label: "Dentes",       icon: ToothIcon,    count: dadosDentes.length },
    { id: "ficha",     label: "Ficha Clínica", icon: ClipboardList, count: fichasClinicas.length },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/pacientes")}
            className="h-8 gap-1.5 px-2 text-[13px] text-muted-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Pacientes
          </Button>
          {!loading && paciente && (
            <>
              <span className="text-muted-foreground/40">/</span>
              <span className="truncate text-[13px] font-medium text-foreground/70">
                {paciente.nome}
              </span>
            </>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-5 animate-spin text-muted-foreground/30" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-32 text-center">
            <p className="text-sm text-muted-foreground/60">{error}</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/pacientes")}>
              Voltar para pacientes
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && paciente && (
          <>
            <PacienteInfoHeader paciente={paciente} />

            {/* Tabs container */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-black/5">

              {/* Tab bar */}
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/20 px-5 py-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-150",
                        active
                          ? "bg-primary text-white shadow-sm shadow-primary/30"
                          : "text-foreground/55 hover:bg-white hover:text-foreground/80 hover:shadow-sm",
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      {tab.label}
                      {tab.count > 0 && (
                        <span
                          className={cn(
                            "min-w-[18px] rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none",
                            active
                              ? "bg-white/25 text-white"
                              : "bg-muted text-muted-foreground/70",
                          )}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === "anotacoes" && (
                  <AnotacoesTab
                    pacienteId={pacienteId}
                    anotacoes={anotacoes}
                    onRefresh={refreshAnotacoes}
                  />
                )}
                {activeTab === "dentes" && (
                  <DentesTab
                    pacienteId={pacienteId}
                    dadosDentes={dadosDentes}
                    onRefresh={refreshDadosDentes}
                  />
                )}
                {activeTab === "ficha" && (
                  <FichaClinicaTab
                    pacienteId={pacienteId}
                    fichasClinicas={fichasClinicas}
                    onRefresh={refreshFichasClinicas}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
