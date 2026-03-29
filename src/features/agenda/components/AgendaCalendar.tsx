import { useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
  DatesSetArg,
} from "@fullcalendar/core";

interface AgendaCalendarProps {
  events: EventInput[];
  currentView: string;
  currentDate: Date;
  onDateSelect: (selectInfo: DateSelectArg) => void;
  onEventClick: (clickInfo: EventClickArg) => void;
  onEventDrop: (dropInfo: EventDropArg) => void;
  onViewChange: (view: string) => void;
  onDateChange: (date: Date) => void;
  onPrevRef: React.RefObject<(() => void) | null>;
  onNextRef: React.RefObject<(() => void) | null>;
  onTodayRef: React.RefObject<(() => void) | null>;
  onGotoDateRef: React.RefObject<((date: Date) => void) | null>;
}

export function AgendaCalendar({
  events,
  currentView,
  currentDate,
  onDateSelect,
  onEventClick,
  onEventDrop,
  onViewChange,
  onDateChange,
  onPrevRef,
  onNextRef,
  onTodayRef,
  onGotoDateRef,
}: AgendaCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    onPrevRef.current = () => calendarRef.current?.getApi().prev();
    onNextRef.current = () => calendarRef.current?.getApi().next();
    onTodayRef.current = () => calendarRef.current?.getApi().today();
    onGotoDateRef.current = (date: Date) =>
      calendarRef.current?.getApi().gotoDate(date);
  }, [onPrevRef, onNextRef, onTodayRef, onGotoDateRef]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (api.view.type !== currentView) {
      api.changeView(currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    const calStart = api.view.activeStart;
    if (calStart.getTime() !== currentDate.getTime()) {
      api.gotoDate(currentDate);
    }
  }, [currentDate]);

  const todayRef = useRef(new Date());

  const renderDayHeader = useCallback((arg: { date: Date; view: { type: string } }) => {
    const d = arg.date;
    const today = todayRef.current;
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const isDay = arg.view.type === "timeGridDay";

    const weekday = d.toLocaleDateString("pt-BR", {
      weekday: isDay ? "long" : "short",
    }).replace(".", "").toUpperCase();

    return (
      <div className="flex flex-col items-center gap-1 py-1">
        <span
          className="text-[10px] font-semibold tracking-widest"
          style={{ color: isToday ? "oklch(0.52 0.14 210)" : "oklch(0.556 0 0 / 70%)" }}
        >
          {weekday}
        </span>
        <span
          className="flex size-7 items-center justify-center rounded-full text-sm"
          style={
            isToday
              ? { background: "oklch(0.88 0.06 210)", color: "oklch(0 0 0)", fontWeight: 800 }
              : { color: "oklch(0.145 0 0)", fontWeight: 400 }
          }
        >
          {d.getDate()}
        </span>
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDatesSet(arg: DatesSetArg) {
    if (arg.start.getTime() !== currentDate.getTime()) {
      onDateChange(arg.start);
    }
    if (arg.view.type !== currentView) {
      onViewChange(arg.view.type);
    }
  }

  return (
    <div className="agenda-calendar rounded-2xl border border-border/40 bg-white p-4 shadow-sm shadow-black/4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        initialDate={currentDate}
        locale={ptBrLocale}
        headerToolbar={false}
        events={events}
        editable
        selectable
        selectMirror
        dayMaxEvents
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        allDaySlot={false}
        height="auto"
        expandRows
        nowIndicator
        select={onDateSelect}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
        datesSet={handleDatesSet}
        eventDisplay="block"
        dayHeaderContent={renderDayHeader}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
      />
    </div>
  );
}
