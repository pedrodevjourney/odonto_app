import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { cadastrarPaciente, listarPacientes } from "@/features/pacientes/services/pacienteService";
import type { Paciente } from "@/features/pacientes/types/paciente";
import type { ConsultaFormData } from "../types/agenda";
import { ConsultaStatus, TipoProcedimento } from "../types/agenda";

const consultaSchema = z
  .object({
    // optional here — validated manually when isNewPatient = false
    pacienteId: z.number().optional(),
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

  // New-patient mode state (outside form schema)
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientNameError, setNewPatientNameError] = useState<string | null>(null);
  const [isCreatingProspect, setIsCreatingProspect] = useState(false);

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

  useEffect(() => {
    form.reset(buildDefaultValues(initialData));
    setIsNewPatient(false);
    setNewPatientName("");
    setNewPatientNameError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.pacienteId, initialData?.dataHoraInicio, initialData?.dataHoraFim]);

  const fetchOptions = useCallback(async () => {
    if (!user?.token) return;
    setLoadingOptions(true);
    try {
      const result = await listarPacientes(user.token, { size: 200 });
      setPacientes(result.content);
    } catch {
      // silent
    } finally {
      setLoadingOptions(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  function toggleNewPatient(checked: boolean) {
    setIsNewPatient(checked);
    setNewPatientName("");
    setNewPatientNameError(null);
    form.setValue("pacienteId", undefined);
    form.clearErrors("pacienteId");
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    // Validate the patient selection depending on mode
    if (isNewPatient) {
      const trimmed = newPatientName.trim();
      if (trimmed.length < 2) {
        setNewPatientNameError("Informe um nome com ao menos 2 caracteres");
        return;
      }
      setNewPatientNameError(null);
      setIsCreatingProspect(true);
      let novoId: number;
      try {
        const novo = await cadastrarPaciente(user.token!, { nome: trimmed, prospecto: true });
        setPacientes((prev) =>
          [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome)),
        );
        novoId = novo.id;
      } finally {
        setIsCreatingProspect(false);
      }
      await onSubmit({
        pacienteId: novoId!,
        dataHoraInicio: data.dataHoraInicio,
        dataHoraFim: data.dataHoraFim,
        tipo: data.tipo as TipoProcedimento,
        observacoes: data.observacoes || undefined,
        status: data.status,
      });
    } else {
      if (!data.pacienteId) {
        form.setError("pacienteId", { message: "Selecione um paciente" });
        return;
      }
      await onSubmit({
        pacienteId: data.pacienteId,
        dataHoraInicio: data.dataHoraInicio,
        dataHoraFim: data.dataHoraFim,
        tipo: data.tipo as TipoProcedimento,
        observacoes: data.observacoes || undefined,
        status: data.status,
      });
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || isCreatingProspect,
    pacientes,
    loadingOptions,
    isNewPatient,
    toggleNewPatient,
    newPatientName,
    setNewPatientName,
    newPatientNameError,
    isCreatingProspect,
  };
}
