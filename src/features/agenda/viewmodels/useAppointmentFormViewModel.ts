import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { listarPacientes } from "@/features/pacientes/services/pacienteService";
import type { Paciente } from "@/features/pacientes/types/paciente";
import type { ConsultaFormData } from "../types/agenda";
import { ConsultaStatus, TipoProcedimento } from "../types/agenda";

const consultaSchema = z.object({
  pacienteId: z.number({ error: "Selecione um paciente" }),
  dataHoraInicio: z.string().min(1, "Informe a data e hora de início"),
  dataHoraFim: z.string().min(1, "Informe a data e hora de fim"),
  tipo: z.enum(Object.values(TipoProcedimento) as [string, ...string[]], {
    error: "Selecione o tipo de procedimento",
  }),
  observacoes: z.string().optional(),
  status: z
    .enum([
      ConsultaStatus.PENDENTE,
      ConsultaStatus.CONFIRMADA,
      ConsultaStatus.CANCELADA,
      ConsultaStatus.CONCLUIDA,
    ])
    .optional(),
});

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

  const form = useForm<ConsultaSchemaType>({
    resolver: zodResolver(consultaSchema),
    mode: "onBlur",
    defaultValues: {
      pacienteId: initialData?.pacienteId ?? undefined,
      dataHoraInicio: initialData?.dataHoraInicio ?? "",
      dataHoraFim: initialData?.dataHoraFim ?? "",
      tipo: initialData?.tipo ?? undefined,
      observacoes: initialData?.observacoes ?? "",
      status: initialData?.status ?? undefined,
    },
  });

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
