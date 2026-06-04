import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/features/pacientes/components/DatePickerField";
import { useAnotacaoViewModel } from "@/features/pacientes/viewmodels/useAnotacaoViewModel";
import type { Anotacao } from "@/features/pacientes/types/prontuario";

interface NovaAnotacaoModalProps {
  open: boolean;
  pacienteId: number;
  anotacaoParaEditar?: Anotacao;
  onClose: () => void;
  onSuccess: () => void;
}

export function NovaAnotacaoModal({
  open,
  pacienteId,
  anotacaoParaEditar,
  onClose,
  onSuccess,
}: NovaAnotacaoModalProps) {
  const { form, handleSubmit, isSubmitting } = useAnotacaoViewModel(
    pacienteId,
    () => { onSuccess(); onClose(); },
    anotacaoParaEditar,
  );

  useEffect(() => {
    if (open) {
      form.reset({
        dataAnotacao: anotacaoParaEditar?.dataAnotacao ?? new Date().toISOString().split("T")[0],
        conteudo: anotacaoParaEditar?.conteudo ?? "",
      });
    }
  }, [open, anotacaoParaEditar, form]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{anotacaoParaEditar ? "Editar Anotação" : "Nova Anotação"}</DialogTitle>
          <DialogDescription>
            {anotacaoParaEditar
              ? "Corrija os dados da anotação clínica."
              : "Registre uma anotação clínica para este paciente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="dataAnotacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <DatePickerField value={field.value} onChange={(v) => field.onChange(v ?? "")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anotação <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva a observação clínica..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                {anotacaoParaEditar ? "Salvar alterações" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
