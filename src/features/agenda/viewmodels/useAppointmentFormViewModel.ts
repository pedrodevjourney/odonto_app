import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { listarPacientes } from "@/features/pacientes/services/pacienteService";
import type { Paciente } from "@/features/pacientes/types/paciente";
import type { ConsultaFormData } from "../types/agenda";
import { ConsultaStatus, TipoProcedimento } from "../types/agenda";

const consultaSchema = z
  .object({
    pacienteId: z.number({ error: "Selecione um paciente" }),
    dataHoraInicio: z.string().min(1, "Informe a data e hora de início"),
    dataHoraFim: z.string().min(1, "Informe a data e hora de fim"),
    tipo: z.enum(Object.values(TipoProcedimento) as [string, ...string[]], {
      error: "Selecione o tipo de procedimento",
    }),
    observacoes: z.string().optional(),
    status: z
      .enum([
        ConsultaStatus.AGENDADA,
        ConsultaStatus.CONFIRMADA,
        ConsultaStatus.REALIZADA,
        ConsultaStatus.CANCELADA,
        ConsultaStatus.NAO_COMPARECEU,
      ])
      .optional(),
  })
  .refine(
    (data) =>
      !data.dataHoraInicio ||
      !data.dataHoraFim ||
      data.dataHoraFim > data.dataHoraInicio,
    {
      message: "O horário de fim deve ser após o início",
      path: ["dataHoraFim"],
    },
  );

type ConsultaSchemaType = z.infer<typeof consultaSchema>;

interface UseAppointmentFormOptions {
  initialData?: Partial<ConsultaFormData>;
  onSubmit: (data: ConsultaFormData) => Promise<void>;
}

export function useAppointmentFormViewModel({
  initialData,
  onSubmit,
}: UseAppointmentFormOptions) {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const buildDefaultValues = (data?: Partial<ConsultaFormData>): ConsultaSchemaType => ({
    pacienteId: data?.pacienteId ?? undefined,
    dataHoraInicio: data?.dataHoraInicio ?? "",
    dataHoraFim: data?.dataHoraFim ?? "",
    tipo: data?.tipo ?? undefined,
    observacoes: data?.observacoes ?? "",
    status: data?.status ?? undefined,
  });

  const form = useForm<ConsultaSchemaType>({
    resolver: zodResolver(consultaSchema),
    mode: "onBlur",
    defaultValues: buildDefaultValues(initialData),
  });

  // Reset form whenever the modal reopens with new data
  useEffect(() => {
    form.reset(buildDefaultValues(initialData));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.pacienteId, initialData?.dataHoraInicio, initialData?.dataHoraFim]);

  const fetchOptions = useCallback(async () => {
    if (!user?.token) return;
    setLoadingOptions(true);
    try {
      const pacientesResult = await listarPacientes(user.token, { size: 100 });
      setPacientes(pacientesResult.content);
    } catch {
      // Options will remain empty
    } finally {
      setLoadingOptions(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleSubmit = form.handleSubmit(async (data) => {
    const payload: ConsultaFormData = {
      ...data,
      observacoes: data.observacoes || undefined,
    } as ConsultaFormData;
    await onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    pacientes,
    loadingOptions,
  };
}
