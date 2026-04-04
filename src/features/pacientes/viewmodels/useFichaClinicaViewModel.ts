import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { addFichaClinica } from "@/features/pacientes/services/prontuarioService";
import type { FichaClinicaFormData } from "@/features/pacientes/types/prontuario";

const schema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  numeroDente: z.number().optional(),
  observacoesClinicas: z.string().optional(),
  deve: z.number().min(0).optional(),
  haver: z.number().min(0).optional(),
  saldo: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

export function useFichaClinicaViewModel(pacienteId: number, onSuccess: () => void) {
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      data: new Date().toISOString().split("T")[0],
      observacoesClinicas: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!user?.token) return;
    const payload: FichaClinicaFormData = {
      data: values.data,
      numeroDente: values.numeroDente,
      observacoesClinicas: values.observacoesClinicas || undefined,
      deve: values.deve,
      haver: values.haver,
      saldo: values.saldo,
    };
    try {
      await addFichaClinica(user.token, pacienteId, payload);
      toast.success("Entrada adicionada à ficha clínica!");
      form.reset({
        data: new Date().toISOString().split("T")[0],
        observacoesClinicas: "",
      });
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar entrada.");
    }
  });

  return { form, handleSubmit, isSubmitting: form.formState.isSubmitting };
}
