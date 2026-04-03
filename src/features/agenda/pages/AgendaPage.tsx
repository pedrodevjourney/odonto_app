import { useEffect, useRef } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { usePageActions } from "@/features/dashboard/contexts/PageActionsContext";
import { useAgendaViewModel } from "../viewmodels/useAgendaViewModel";
import { AgendaToolbar } from "../components/AgendaToolbar";
import { AgendaCalendar } from "../components/AgendaCalendar";
import { AppointmentModal } from "../components/AppointmentModal";
import { GoogleCalendarProvider } from "../contexts/GoogleCalendarContext";
import { GoogleCalendarButton } from "../components/GoogleCalendarButton";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

function AgendaContent() {
  const { setActions } = usePageActions();
  const vm = useAgendaViewModel();

  const onPrevRef = useRef<(() => void) | null>(null);
  const onNextRef = useRef<(() => void) | null>(null);
  const onTodayRef = useRef<(() => void) | null>(null);
  const onGotoDateRef = useRef<((date: Date) => void) | null>(null);

  useEffect(() => {
    setActions(
      <div className="flex items-center gap-2">
        {GOOGLE_CLIENT_ID && <GoogleCalendarButton />}
        <Button
          onClick={() => vm.openCreateModal()}
          className="h-9 gap-2 rounded-lg px-5 text-[13px] font-semibold tracking-wide shadow-sm"
        >
          <CalendarPlus className="size-[15px]" />
          Nova Consulta
        </Button>
      </div>,
    );
    return () => setActions(null);
  }, [setActions, vm.openCreateModal]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-2xl text-foreground">Agenda</h1>
        <p className="mt-0.5 text-sm text-muted-foreground/70">
          Gerencie os agendamentos da clínica
        </p>
      </div>

      <AgendaToolbar
        currentDate={vm.currentDate}
        currentView={vm.currentView}
        onViewChange={vm.setCurrentView}
        onToday={() => onTodayRef.current?.()}
        onPrev={() => onPrevRef.current?.()}
        onNext={() => onNextRef.current?.()}
        onGotoDate={(date) => onGotoDateRef.current?.(date)}
      />

      {vm.error && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
          <span>{vm.error}</span>
          <Button variant="outline" size="sm" onClick={vm.refetch}>
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {vm.loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70">
            <Loader2 className="size-5 animate-spin text-muted-foreground/40" />
          </div>
        )}
        <AgendaCalendar
          events={vm.events}
          currentView={vm.currentView}
          currentDate={vm.currentDate}
          onDateSelect={vm.handleDateSelect}
          onEventClick={vm.handleEventClick}
          onEventDrop={vm.handleEventDrop}
          onViewChange={vm.setCurrentView}
          onDateChange={vm.setCurrentDate}
          onPrevRef={onPrevRef}
          onNextRef={onNextRef}
          onTodayRef={onTodayRef}
          onGotoDateRef={onGotoDateRef}
        />
      </div>

      <AppointmentModal
        open={vm.isModalOpen}
        onClose={vm.closeModal}
        mode={vm.modalMode}
        consulta={vm.selectedConsulta}
        defaultStart={vm.defaultStart}
        defaultEnd={vm.defaultEnd}
        onSubmit={vm.handleCreateOrUpdate}
        onCancel={vm.handleCancel}
        onDelete={vm.handleDelete}
      />
    </div>
  );
}

export function AgendaPage() {
  if (!GOOGLE_CLIENT_ID) {
    return <AgendaContent />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleCalendarProvider>
        <AgendaContent />
      </GoogleCalendarProvider>
    </GoogleOAuthProvider>
  );
}
