import type { EventContentArg } from "@fullcalendar/core";
import {
  ConsultaStatus,
  TIPO_PROCEDIMENTO_LABELS,
  type Consulta,
} from "../types/agenda";
import { getStatusColor } from "../constants/statusConfig";

interface CalendarEventContentProps {
  arg: EventContentArg;
}

export function CalendarEventContent({ arg }: CalendarEventContentProps) {
  const consulta = arg.event.extendedProps.consulta as Consulta | undefined;
  const status = consulta?.status ?? ConsultaStatus.AGENDADA;
  const colors = getStatusColor(status);
  const isMonth = arg.view.type === "dayGridMonth";

  if (isMonth) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "1px 6px",
          width: "100%",
          overflow: "hidden",
          backgroundColor: colors.bg,
          borderLeft: `3px solid ${colors.border}`,
          borderRadius: "0 3px 3px 0",
          height: "100%",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: colors.text,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
        >
          {arg.timeText && (
            <span style={{ color: colors.time, marginRight: "3px" }}>
              {arg.timeText}
            </span>
          )}
          {consulta?.pacienteNome ?? arg.event.title}
        </span>
      </div>
    );
  }

  const procedimento = consulta
    ? TIPO_PROCEDIMENTO_LABELS[consulta.tipo]
    : "";

  return (
    <div
      style={{
        borderLeft: `3px solid ${colors.border}`,
        backgroundColor: colors.bg,
        padding: "4px 7px",
        height: "100%",
        overflow: "hidden",
        borderRadius: "0 5px 5px 0",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        boxSizing: "border-box",
      }}
    >
      {arg.timeText && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: colors.time,
            lineHeight: 1.2,
            letterSpacing: "0.01em",
          }}
        >
          {arg.timeText}
        </span>
      )}
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: colors.text,
          lineHeight: 1.25,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {consulta?.pacienteNome ?? arg.event.title}
      </span>
      {procedimento && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            color: colors.text,
            opacity: 0.65,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {procedimento}
        </span>
      )}
    </div>
  );
}
