import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { addAnotacao } from "@/features/pacientes/services/prontuarioService";
import type { AnotacaoFormData } from "@/features/pacientes/types/prontuario";

const schema = z.object({
  dataAnotacao: z.string().min(1, "Data é obrigatória"),
  conteudo: z.string().min(1, "Conteúdo é obrigatório"),
});

type FormValues = z.infer<typeof schema>;

export function useAnotacaoViewModel(pacienteId: number, onSuccess: () => void) {
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dataAnotacao: new Date().toISOString().split("T")[0],
      conteudo: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!user?.token) return;
    const payload: AnotacaoFormData = {
      dataAnotacao: values.dataAnotacao,
      conteudo: values.conteudo,
    };
    try {
      await addAnotacao(user.token, pacienteId, payload);
      toast.success("Anotação adicionada!");
      form.reset({
        dataAnotacao: new Date().toISOString().split("T")[0],
        conteudo: "",
      });
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar anotação.");
    }
  });

  return { form, handleSubmit, isSubmitting: form.formState.isSubmitting };
}
