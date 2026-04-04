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
import { useFichaClinicaViewModel } from "@/features/pacientes/viewmodels/useFichaClinicaViewModel";
import { DENTES_FDI } from "@/features/pacientes/types/prontuario";

interface NovaFichaClinicaModalProps {
  open: boolean;
  pacienteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function NovaFichaClinicaModal({
  open,
  pacienteId,
  onClose,
  onSuccess,
}: NovaFichaClinicaModalProps) {
  const { form, handleSubmit, isSubmitting } = useFichaClinicaViewModel(
    pacienteId,
    () => { onSuccess(); onClose(); },
  );

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Entrada — Ficha Clínica</DialogTitle>
          <DialogDescription>
            Registre um procedimento ou movimentação financeira.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePickerField
                        value={field.value}
                        onChange={(v) => field.onChange(v ?? "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroDente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dente (FDI)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Nenhum" />
                        </SelectTrigger>
                        <SelectContent>
                          {DENTES_FDI.map((n) => (
                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoesClinicas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedimento / Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex.: Extração do dente 36, limpeza..."
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3">
              {(["deve", "haver", "saldo"] as const).map((field_name) => (
                <FormField
                  key={field_name}
                  control={form.control}
                  name={field_name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {field_name} (R$)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={field_name !== "saldo" ? "0" : undefined}
                          placeholder="0,00"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
