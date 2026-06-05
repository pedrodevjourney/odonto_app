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
import { DatePickerField } from "@/features/pacientes/components/DatePickerField";
import { Button } from "@/components/ui/button";
import { useEditarPacienteViewModel } from "@/features/pacientes/viewmodels/useEditarPacienteViewModel";
import { maskPhone, maskCpf } from "@/features/pacientes/utils/pacienteHelpers";
import type { Paciente } from "@/features/pacientes/types/paciente";

const ESTADO_CIVIL_LABELS: Record<string, string> = {
  SOLTEIRO: "Solteiro(a)",
  CASADO: "Casado(a)",
  DIVORCIADO: "Divorciado(a)",
  VIUVO: "Viúvo(a)",
  UNIAO_ESTAVEL: "União Estável",
};

const ESTADOS_CIVIS = Object.keys(ESTADO_CIVIL_LABELS);

interface EditarPacienteModalProps {
  open: boolean;
  paciente: Paciente;
  onClose: () => void;
  onSuccess: (updated: Paciente) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {children}
      </span>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  );
}

export function EditarPacienteModal({
  open,
  paciente,
  onClose,
  onSuccess,
}: EditarPacienteModalProps) {
  const { form, handleSubmit, isSubmitting } = useEditarPacienteViewModel(
    paciente,
    onSuccess,
  );

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
          <DialogDescription>
            Atualize os dados do paciente. Apenas o nome é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-1 py-1">
              <SectionTitle>Identificação</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Nome <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(maskCpf(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SectionTitle>Dados Pessoais</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione a data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estadoCivil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Civil</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione">
                              {field.value
                                ? ESTADO_CIVIL_LABELS[field.value]
                                : undefined}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS_CIVIS.map((ec) => (
                              <SelectItem key={ec} value={ec}>
                                {ESTADO_CIVIL_LABELS[ec]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: Engenheiro"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nacionalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: Brasileiro(a)"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SectionTitle>Contato</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(maskPhone(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefoneSecundario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone Secundário</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(maskPhone(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SectionTitle>Endereço</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="residencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro / Região</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex.: Centro"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enderecoCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua, número, complemento"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SectionTitle>Tratamento</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="indicadoPor"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Indicado Por</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome de quem indicou"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inicioTratamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início do Tratamento</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione a data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terminoTratamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Término do Tratamento</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione a data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interrupcaoTratamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interrupção do Tratamento</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione a data"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
