import type { Consulta, GoogleCalendarEvent } from "../types/agenda";
import { TIPO_PROCEDIMENTO_LABELS } from "../types/agenda";

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

async function googleFetch<T>(
  accessToken: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${CALENDAR_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message ?? `Google Calendar error: ${response.status}`,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function listGoogleEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<GoogleCalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "100",
  });

  const result = await googleFetch<{ items: GoogleCalendarEvent[] }>(
    accessToken,
    `/calendars/primary/events?${params}`,
  );

  return result?.items ?? [];
}

export async function insertGoogleEvent(
  accessToken: string,
  event: Omit<GoogleCalendarEvent, "id">,
): Promise<GoogleCalendarEvent> {
  return googleFetch<GoogleCalendarEvent>(
    accessToken,
    "/calendars/primary/events",
    {
      method: "POST",
      body: JSON.stringify(event),
    },
  );
}

export async function updateGoogleEvent(
  accessToken: string,
  eventId: string,
  event: Partial<GoogleCalendarEvent>,
): Promise<GoogleCalendarEvent> {
  return googleFetch<GoogleCalendarEvent>(
    accessToken,
    `/calendars/primary/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(event),
    },
  );
}

export async function deleteGoogleEvent(
  accessToken: string,
  eventId: string,
): Promise<void> {
  return googleFetch<void>(
    accessToken,
    `/calendars/primary/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE" },
  );
}

export function mapConsultaToGoogleEvent(
  consulta: Consulta,
): Omit<GoogleCalendarEvent, "id"> {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    summary: `${consulta.pacienteNome} — ${TIPO_PROCEDIMENTO_LABELS[consulta.tipo]}`,
    description: consulta.observacoes ?? undefined,
    start: { dateTime: consulta.dataHoraInicio, timeZone },
    end: { dateTime: consulta.dataHoraFim, timeZone },
  };
}
