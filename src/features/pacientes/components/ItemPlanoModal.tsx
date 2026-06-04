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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/features/pacientes/components/DatePickerField";
import { usePlanoTratamentoViewModel } from "@/features/pacientes/viewmodels/usePlanoTratamentoViewModel";
import type { PlanoTratamento } from "@/features/pacientes/types/prontuario";

interface ItemPlanoModalProps {
  open: boolean;
  pacienteId: number;
  itemParaEditar?: PlanoTratamento;
  onClose: () => void;
  onSuccess: () => void;
}

export function ItemPlanoModal({
  open,
  pacienteId,
  itemParaEditar,
  onClose,
  onSuccess,
}: ItemPlanoModalProps) {
  const { form, handleSubmit, isSubmitting } = usePlanoTratamentoViewModel(
    pacienteId,
    () => { onSuccess(); onClose(); },
    itemParaEditar,
  );

  useEffect(() => {
    if (open) {
      form.reset({
        procedimento: itemParaEditar?.procedimento ?? "",
        numeroDente: itemParaEditar?.numeroDente ?? undefined,
        status: itemParaEditar?.status ?? "PENDENTE",
        observacoes: itemParaEditar?.observacoes ?? "",
        valor: itemParaEditar?.valor ?? undefined,
        dataPrevista: itemParaEditar?.dataPrevista ?? "",
        dataConclusao: itemParaEditar?.dataConclusao ?? "",
      });
    }
  }, [open, itemParaEditar, form]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{itemParaEditar ? "Editar Procedimento" : "Novo Procedimento"}</DialogTitle>
          <DialogDescription>
            {itemParaEditar ? "Atualize os dados do procedimento." : "Adicione um procedimento ao plano de tratamento."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="procedimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedimento <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Extração, Restauração, Canal..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numeroDente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dente (FDI)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 36"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? "PENDENTE"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                        <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataPrevista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Prevista</FormLabel>
                    <FormControl>
                      <DatePickerField value={field.value ?? ""} onChange={(v) => field.onChange(v ?? "")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes adicionais..." rows={3} {...field} value={field.value ?? ""} />
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
                {itemParaEditar ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
