import { useState } from "react";
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
import { Check, Info, Loader2, Trash2, UserRoundPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { DateTimeInput } from "./DateTimeInput";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { PatientCombobox } from "./PatientCombobox";
import { useAppointmentFormViewModel } from "../viewmodels/useAppointmentFormViewModel";
import type { Consulta, ConsultaFormData } from "../types/agenda";
import {
  ConsultaStatus,
  TipoProcedimento,
  TIPO_PROCEDIMENTO_LABELS,
} from "../types/agenda";
import { getStatusLabel, STATUS_LABELS } from "../constants/statusConfig";

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  consulta: Consulta | null;
  defaultStart: string;
  defaultEnd: string;
  onSubmit: (data: ConsultaFormData) => Promise<void>;
  onCancel?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export function AppointmentModal({
  open,
  onClose,
  mode,
  consulta,
  defaultStart,
  defaultEnd,
  onSubmit,
  onCancel,
  onDelete,
}: AppointmentModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    form,
    handleSubmit,
    isSubmitting,
    pacientes,
    loadingOptions,
    isNewPatient,
    toggleNewPatient,
    newPatientName,
    setNewPatientName,
    newPatientNameError,
    isCreatingProspect,
  } = useAppointmentFormViewModel({
    initialData: consulta
      ? {
          pacienteId: consulta.pacienteId,
          dataHoraInicio: defaultStart,
          dataHoraFim: defaultEnd,
          tipo: consulta.tipo,
          observacoes: consulta.observacoes ?? "",
          status: consulta.status,
        }
      : {
          dataHoraInicio: defaultStart,
          dataHoraFim: defaultEnd,
          observacoes: "",
        },
    onSubmit,
  });

  const isEdit = mode === "edit";
  const isCancelled = consulta?.status === ConsultaStatus.CANCELADA;

  async function handleDeleteConfirm() {
    if (consulta && onDelete) {
      await onDelete(consulta.id);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {isEdit ? "Editar Consulta" : "Nova Consulta"}
              {isEdit && consulta && (
                <>
                  <StatusBadge status={consulta.status} />
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="-my-1 ml-auto mr-6 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Excluir consulta"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Atualize os dados da consulta."
                : "Preencha os dados para agendar uma nova consulta."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">

                {/* ── Patient field ── */}
                <div className="col-span-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="pacienteId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Paciente</FormLabel>

                          {/* Novo paciente toggle — inline with label */}
                          {!isEdit && (
                            <label
                              htmlFor="novo-paciente-toggle"
                              className={cn(
                                "flex cursor-pointer select-none items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                                isNewPatient
                                  ? "bg-amber-50 font-semibold text-amber-700 ring-1 ring-amber-200"
                                  : "text-muted-foreground hover:bg-muted/50",
                              )}
                            >
                              <input
                                id="novo-paciente-toggle"
                                type="checkbox"
                                className="sr-only"
                                checked={isNewPatient}
                                onChange={(e) => toggleNewPatient(e.target.checked)}
                                disabled={isSubmitting}
                              />
                              <span
                                className={cn(
                                  "flex size-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                                  isNewPatient
                                    ? "border-amber-500 bg-amber-500 text-white"
                                    : "border-muted-foreground/40 bg-transparent",
                                )}
                              >
                                {isNewPatient && <Check className="size-2.5" />}
                              </span>
                              <UserRoundPlus className="size-3 shrink-0" />
                              <span>Paciente não cadastrado</span>
                            </label>
                          )}
                        </div>

                        <FormControl>
                          {isNewPatient ? (
                            /* New-patient name input */
                            <div className="space-y-1.5">
                              <Input
                                placeholder="Nome ou apelido do paciente..."
                                value={newPatientName}
                                onChange={(e) => {
                                  setNewPatientName(e.target.value);
                                }}
                                disabled={isSubmitting}
                                autoFocus
                              />
                              {newPatientNameError && (
                                <p className="text-[12px] font-medium text-destructive">
                                  {newPatientNameError}
                                </p>
                              )}
                              <div className="flex items-start gap-1.5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-200">
                                <Info className="mt-px size-3.5 shrink-0" />
                                <span>
                                  Apenas o nome é necessário agora. O cadastro
                                  completo pode ser feito depois, quando o
                                  paciente chegar.
                                </span>
                              </div>
                            </div>
                          ) : (
                            /* Existing patient search */
                            <PatientCombobox
                              patients={pacientes}
                              value={field.value}
                              onChange={field.onChange}
                              loading={loadingOptions}
                              disabled={isSubmitting}
                            />
                          )}
                        </FormControl>
                        {!isNewPatient && <FormMessage />}
                      </FormItem>
                    )}
                  />

                </div>

                {/* ── Procedure ── */}
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Procedimento</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o procedimento">
                              {field.value
                                ? (TIPO_PROCEDIMENTO_LABELS[
                                    field.value as TipoProcedimento
                                  ] ?? field.value)
                                : undefined}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(TipoProcedimento).map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {TIPO_PROCEDIMENTO_LABELS[tipo]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ── Date / time ── */}
                <FormField
                  control={form.control}
                  name="dataHoraInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início</FormLabel>
                      <FormControl>
                        <DateTimeInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataHoraFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim</FormLabel>
                      <FormControl>
                        <DateTimeInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ── Status (edit only) ── */}
                {isEdit && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {field.value
                                  ? getStatusLabel(
                                      field.value as ConsultaStatus,
                                    )
                                  : undefined}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ConsultaStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {STATUS_LABELS[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* ── Notes ── */}
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações adicionais..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                {isEdit && !isCancelled && onCancel && consulta && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => onCancel(consulta.id)}
                    className="mr-auto"
                  >
                    Cancelar Consulta
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button type="submit" disabled={isSubmitting || isCancelled}>
                  {(isSubmitting || isCreatingProspect) && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  {isEdit ? "Salvar" : "Agendar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        patientName={consulta?.pacienteNome}
      />
    </>
  );
}
