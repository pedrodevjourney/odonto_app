import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { addItemPlano, updateItemPlano } from "@/features/pacientes/services/prontuarioService";
import type { PlanoTratamento } from "@/features/pacientes/types/prontuario";

/**
 * Campo numérico opcional vindo de um <input>: o formulário entrega string, a
 * aplicação precisa de number. Declarado como union em vez de z.coerce para que o
 * tipo de entrada seja `string | number` (com z.coerce ele é `unknown`, e o valor
 * deixa de ser aceito pelo componente de input).
 */
const numeroOpcional = z
  .union([z.string(), z.number()])
  .optional()
  .transform((valor) => {
    if (valor === undefined || valor === "") return undefined;
    return Number(valor); // texto inválido virá NaN e é recusado no pipe abaixo
  })
  .pipe(z.number("Informe um número válido").optional());

const schema = z.object({
  procedimento: z.string().min(1, "Procedimento é obrigatório"),
  numeroDente: numeroOpcional,
  status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"]).optional(),
  observacoes: z.string().optional(),
  valor: numeroOpcional,
  dataPrevista: z.string().optional(),
  dataConclusao: z.string().optional(),
});

// z.coerce faz o tipo de entrada do formulário (o que vem dos inputs) ser
// diferente do de saída (o que o schema devolve validado). Os dois genéricos
// precisam ser explícitos para o resolver bater com o useForm.
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function usePlanoTratamentoViewModel(
  pacienteId: number,
  onSuccess: () => void,
  itemParaEditar?: PlanoTratamento,
) {
  const { user } = useAuth();

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      procedimento: itemParaEditar?.procedimento ?? "",
      numeroDente: itemParaEditar?.numeroDente ?? undefined,
      status: itemParaEditar?.status ?? "PENDENTE",
      observacoes: itemParaEditar?.observacoes ?? "",
      valor: itemParaEditar?.valor ?? undefined,
      dataPrevista: itemParaEditar?.dataPrevista ?? "",
      dataConclusao: itemParaEditar?.dataConclusao ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!user?.token) return;
    try {
      const payload = {
        procedimento: values.procedimento,
        numeroDente: values.numeroDente || undefined,
        status: values.status ?? "PENDENTE",
        observacoes: values.observacoes || undefined,
        valor: values.valor || undefined,
        dataPrevista: values.dataPrevista || undefined,
        dataConclusao: values.dataConclusao || undefined,
      };
      if (itemParaEditar) {
        await updateItemPlano(user.token, pacienteId, itemParaEditar.id, payload);
        toast.success("Item atualizado!");
      } else {
        await addItemPlano(user.token, pacienteId, payload);
        toast.success("Item adicionado ao plano!");
        form.reset({ procedimento: "", status: "PENDENTE" });
      }
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar item.");
    }
  });

  return { form, handleSubmit, isSubmitting: form.formState.isSubmitting };
}
