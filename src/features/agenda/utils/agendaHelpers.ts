import { format, startOfWeek, endOfWeek } from "date-fns";
import type { EventInput } from "@fullcalendar/core";
import type { Consulta } from "../types/agenda";

export function consultaToCalendarEvent(consulta: Consulta): EventInput {
  return {
    id: String(consulta.id),
    title: consulta.pacienteNome,
    start: consulta.dataHoraInicio,
    end: consulta.dataHoraFim,
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: "transparent",
    extendedProps: {
      consulta,
    },
  };
}

export function getWeekRange(
  date: Date,
  firstDay: number = 0,
): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, {
      weekStartsOn: firstDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    }),
    end: endOfWeek(date, {
      weekStartsOn: firstDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    }),
  };
}

export function toLocalDateTimeString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}
