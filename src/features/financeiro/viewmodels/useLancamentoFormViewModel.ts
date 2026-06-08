import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  criarLancamento,
  atualizarLancamento,
} from "@/features/financeiro/services/lancamentoService";
import type { LancamentoResponse } from "@/features/financeiro/types/lancamento";

const lancamentoSchema = z.object({
  tipo: z.enum(["RECEITA", "DESPESA"], { message: "Selecione o tipo." }),
  descricao: z.string().min(1, "Descrição é obrigatória."),
  data: z.string().min(1, "Data é obrigatória."),
  valorTotal: z.number().min(0).optional(),
  valorPago: z.number().min(0).optional(),
});

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;

export function useLancamentoFormViewModel(
  pacienteId: number,
  lancamento: LancamentoResponse | null,
  onSuccess: () => void,
) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!lancamento;

  const form = useForm<LancamentoFormValues, unknown, LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: {
      tipo: lancamento?.tipo ?? "RECEITA",
      descricao: lancamento?.descricao ?? "",
      data: lancamento?.data ?? new Date().toISOString().slice(0, 10),
      valorTotal: lancamento?.valorTotal ?? undefined,
      valorPago: lancamento?.valorPago ?? undefined,
    },
  });

  async function onSubmit(values: LancamentoFormValues) {
    if (!user?.token) return;
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await atualizarLancamento(user.token, lancamento!.id, {
          tipo: values.tipo,
          descricao: values.descricao,
          data: values.data,
          valorTotal: values.valorTotal,
          valorPago: values.valorPago,
        });
        toast.success("Lançamento atualizado com sucesso.");
      } else {
        await criarLancamento(user.token, {
          pacienteId,
          tipo: values.tipo,
          descricao: values.descricao,
          data: values.data,
          valorTotal: values.valorTotal,
          valorPago: values.valorPago,
        });
        toast.success("Lançamento criado com sucesso.");
      }
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar lançamento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit);

  return { form, handleSubmit, isSubmitting, isEditing };
}
