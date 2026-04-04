import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { addDadosDente } from "@/features/pacientes/services/prontuarioService";
import type { DadosDenteFormData } from "@/features/pacientes/types/prontuario";

const schema = z.object({
  numeroDente: z
    .number({ error: "Selecione o número do dente" })
    .min(11)
    .max(48),
  cor: z.string().optional(),
  escurecimento: z.string().optional(),
  forma: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function useDadosDentesViewModel(pacienteId: number, onSuccess: () => void) {
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cor: "",
      escurecimento: "",
      forma: "",
      observacoes: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!user?.token) return;
    const payload: DadosDenteFormData = {
      numeroDente: values.numeroDente,
      cor: values.cor || undefined,
      escurecimento: values.escurecimento || undefined,
      forma: values.forma || undefined,
      observacoes: values.observacoes || undefined,
    };
    try {
      await addDadosDente(user.token, pacienteId, payload);
      toast.success("Dados do dente adicionados!");
      form.reset({ cor: "", escurecimento: "", forma: "", observacoes: "" });
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar dados do dente.");
    }
  });

  return { form, handleSubmit, isSubmitting: form.formState.isSubmitting };
}
