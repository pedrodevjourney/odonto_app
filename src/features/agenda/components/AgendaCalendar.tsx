import { useRef, useEffect } from "react";
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
    if (api && api.view.type !== currentView) {
      api.changeView(currentView);
    }
  }, [currentView]);

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
