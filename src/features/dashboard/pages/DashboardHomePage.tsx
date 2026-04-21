import {
  Users,
  CalendarDays,
  DollarSign,
  CalendarRange,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/features/financeiro/utils/formatBRL";
import { useDashboardViewModel } from "../viewmodels/useDashboardViewModel";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { KpiCard } from "../components/KpiCard";
import { FinancialSummaryCard } from "../components/FinancialSummaryCard";
import { AttendanceDonutChart } from "../components/AttendanceDonutChart";
import { NextAppointmentsTable } from "../components/NextAppointmentsTable";
import { ProceduresBarChart } from "../components/ProceduresBarChart";
import { Button } from "@/components/ui/button";

export function DashboardHomePage() {
  const { data, loading, error, refetch } = useDashboardViewModel();

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-32 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Visão Geral
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Painel da Borges Odontologia
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
            <Activity className="size-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              <span className="font-bold tabular-nums text-foreground">
                {data.consultas.semana}
              </span>{" "}
              consultas esta semana
            </span>
          </div>
        </div>

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Pacientes"
            value={data.pacientes.total}
            icon={Users}
            subtitle={`${data.pacientes.emTratamento} em tratamento`}
          />
          <KpiCard
            label="Consultas Hoje"
            value={data.consultas.hoje}
            icon={CalendarDays}
          />
          <KpiCard
            label="Consultas Semana"
            value={data.consultas.semana}
            icon={CalendarRange}
          />
          <KpiCard
            label="Saldo do Mês"
            value={formatBRL(data.financeiro.saldoMes)}
            icon={DollarSign}
            trend={data.financeiro.saldoMes >= 0 ? "up" : "down"}
            className={cn(
              data.financeiro.saldoMes >= 0
                ? "[&_.text-2xl]:text-emerald-600"
                : "[&_.text-2xl]:text-red-500",
            )}
          />
        </div>

        {/* Row 2: Financial Summary + Attendance Donut */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FinancialSummaryCard financeiro={data.financeiro} />
          <AttendanceDonutChart consultas={data.consultas} />
        </div>

        {/* Row 3: Next Appointments + Procedures Chart */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NextAppointmentsTable consultas={data.proximasConsultas} />
          <ProceduresBarChart
            procedimentos={data.procedimentosMaisRealizados}
          />
        </div>
      </div>
    </div>
  );
}
