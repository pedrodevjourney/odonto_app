import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core";
import type { EventInput } from "@fullcalendar/core";
import { format, addHours } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOptionalGoogleCalendar } from "../contexts/GoogleCalendarContext";
import {
  listarConsultas,
  criarConsulta,
  atualizarConsulta,
  cancelarConsulta,
  excluirConsulta,
} from "../services/agendaService";
import {
  insertGoogleEvent,
  updateGoogleEvent,
  deleteGoogleEvent,
  mapConsultaToGoogleEvent,
} from "../services/googleCalendarService";
import type { Consulta, ConsultaFormData } from "../types/agenda";
import {
  consultaToCalendarEvent,
  getWeekRange,
  toLocalDateTimeString,
} from "../utils/agendaHelpers";

type ModalMode = "create" | "edit";

export interface AgendaViewModel {
  events: EventInput[];
  loading: boolean;
  error: string | null;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isModalOpen: boolean;
  modalMode: ModalMode;
  selectedConsulta: Consulta | null;
  defaultStart: string;
  defaultEnd: string;
  openCreateModal: (start?: Date, end?: Date) => void;
  openEditModal: (consulta: Consulta) => void;
  closeModal: () => void;
  handleDateSelect: (selectInfo: DateSelectArg) => void;
  handleEventClick: (clickInfo: EventClickArg) => void;
  handleEventDrop: (dropInfo: EventDropArg) => void;
  handleCreateOrUpdate: (data: ConsultaFormData) => Promise<void>;
  handleCancel: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  refetch: () => void;
}

export function useAgendaViewModel(): AgendaViewModel {
  const { user } = useAuth();
  const google = useOptionalGoogleCalendar();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("timeGridWeek");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(
    null,
  );
  const [defaultStart, setDefaultStart] = useState("");
  const [defaultEnd, setDefaultEnd] = useState("");

  const fetchConsultas = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    setError(null);
    try {
      const { start, end } = getWeekRange(currentDate);
      const result = await listarConsultas(user.token, {
        dataInicio: format(start, "yyyy-MM-dd"),
        dataFim: format(end, "yyyy-MM-dd"),
      });
      setConsultas(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar consultas.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.token, currentDate]);

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  const events: EventInput[] = useMemo(
    () => consultas.map(consultaToCalendarEvent),
    [consultas],
  );

  const openCreateModal = useCallback((start?: Date, end?: Date) => {
    const now = start ?? new Date();
    const endTime = end ?? addHours(now, 1);
    setDefaultStart(toLocalDateTimeString(now));
    setDefaultEnd(toLocalDateTimeString(endTime));
    setSelectedConsulta(null);
    setModalMode("create");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((consulta: Consulta) => {
    setSelectedConsulta(consulta);
    setDefaultStart(toLocalDateTimeString(new Date(consulta.dataHoraInicio)));
    setDefaultEnd(toLocalDateTimeString(new Date(consulta.dataHoraFim)));
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedConsulta(null);
  }, []);

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      openCreateModal(selectInfo.start, selectInfo.end);
    },
    [openCreateModal],
  );

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const consulta = clickInfo.event.extendedProps.consulta as Consulta;
      openEditModal(consulta);
    },
    [openEditModal],
  );

  const handleEventDrop = useCallback(
    async (dropInfo: EventDropArg) => {
      if (!user?.token) return;
      const consulta = dropInfo.event.extendedProps.consulta as Consulta;
      const newStart = dropInfo.event.start;
      const newEnd = dropInfo.event.end;
      if (!newStart || !newEnd) return;

      try {
        await atualizarConsulta(user.token, consulta.id, {
          dataHoraInicio: newStart.toISOString(),
          dataHoraFim: newEnd.toISOString(),
        });
        toast.success("Consulta reagendada com sucesso!");
        fetchConsultas();
      } catch {
        toast.error("Erro ao reagendar consulta.");
        dropInfo.revert();
      }
    },
    [user?.token, fetchConsultas],
  );

  const syncToGoogle = useCallback(
    async (consulta: Consulta): Promise<string | undefined> => {
      if (!google?.isConnected || !google.accessToken) return undefined;
      try {
        const event = mapConsultaToGoogleEvent(consulta);
        if (consulta.googleEventId) {
          await updateGoogleEvent(
            google.accessToken,
            consulta.googleEventId,
            event,
          );
          return consulta.googleEventId;
        } else {
          const created = await insertGoogleEvent(google.accessToken, event);
          return created.id;
        }
      } catch {
        // Google sync is best-effort — don't block the main flow
        return undefined;
      }
    },
    [google?.isConnected, google?.accessToken],
  );

  const handleCreateOrUpdate = useCallback(
    async (data: ConsultaFormData) => {
      if (!user?.token) return;
      try {
        let result: Consulta;
        if (modalMode === "edit" && selectedConsulta) {
          result = await atualizarConsulta(
            user.token,
            selectedConsulta.id,
            data,
          );
          toast.success("Consulta atualizada com sucesso!");
        } else {
          result = await criarConsulta(user.token, data);
          toast.success("Consulta criada com sucesso!");
        }

        const googleEventId = await syncToGoogle(result);
        if (googleEventId && !result.googleEventId) {
          // Persist the new Google event ID back to the backend
          atualizarConsulta(user.token, result.id, { googleEventId }).catch(
            () => {},
          );
        }

        closeModal();
        fetchConsultas();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao salvar consulta.",
        );
      }
    },
    [
      user?.token,
      modalMode,
      selectedConsulta,
      closeModal,
      fetchConsultas,
      syncToGoogle,
    ],
  );

  const handleCancel = useCallback(
    async (id: number) => {
      if (!user?.token) return;
      try {
        await cancelarConsulta(user.token, id);
        const consulta = consultas.find((c) => c.id === id);
        if (
          consulta?.googleEventId &&
          google?.isConnected &&
          google.accessToken
        ) {
          deleteGoogleEvent(google.accessToken, consulta.googleEventId).catch(
            () => {},
          );
        }
        toast.success("Consulta cancelada.");
        closeModal();
        fetchConsultas();
      } catch {
        toast.error("Erro ao cancelar consulta.");
      }
    },
    [
      user?.token,
      closeModal,
      fetchConsultas,
      consultas,
      google?.isConnected,
      google?.accessToken,
    ],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!user?.token) return;
      try {
        const consulta = consultas.find((c) => c.id === id);
        await excluirConsulta(user.token, id);
        if (
          consulta?.googleEventId &&
          google?.isConnected &&
          google.accessToken
        ) {
          deleteGoogleEvent(google.accessToken, consulta.googleEventId).catch(
            () => {},
          );
        }
        toast.success("Consulta excluída permanentemente.");
        closeModal();
        fetchConsultas();
      } catch {
        toast.error("Erro ao excluir consulta.");
      }
    },
    [
      user?.token,
      closeModal,
      fetchConsultas,
      consultas,
      google?.isConnected,
      google?.accessToken,
    ],
  );

  return {
    events,
    loading,
    error,
    currentDate,
    setCurrentDate,
    currentView,
    setCurrentView,
    isModalOpen,
    modalMode,
    selectedConsulta,
    defaultStart,
    defaultEnd,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDateSelect,
    handleEventClick,
    handleEventDrop,
    handleCreateOrUpdate,
    handleCancel,
    handleDelete,
    refetch: fetchConsultas,
  };
}
