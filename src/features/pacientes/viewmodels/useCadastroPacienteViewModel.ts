import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { cadastrarPaciente } from "@/features/pacientes/services/pacienteService";
import {
  ESTADO_CIVIL_VALUES,
  type PacienteFormData,
} from "@/features/pacientes/types/paciente";
import { validateCpf } from "@/features/pacientes/utils/pacienteHelpers";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.replace(/\D/g, "").length === 0 || validateCpf(val),
      { message: "CPF inválido" },
    ),
  dataNascimento: z.string().optional(),
  estadoCivil: z.enum(ESTADO_CIVIL_VALUES).optional(),
  profissao: z.string().optional(),
  nacionalidade: z.string().optional(),
  telefone: z.string().optional(),
  telefoneSecundario: z.string().optional(),
  residencia: z.string().optional(),
  enderecoCompleto: z.string().optional(),
  indicadoPor: z.string().optional(),
  inicioTratamento: z.string().optional(),
  terminoTratamento: z.string().optional(),
  interrupcaoTratamento: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function useCadastroPacienteViewModel(onSuccess: () => void) {
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", cpf: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!user?.token) return;

    const payload: PacienteFormData = {
      nome: values.nome,
      cpf: values.cpf || undefined,
      dataNascimento: values.dataNascimento || undefined,
      estadoCivil: values.estadoCivil,
      profissao: values.profissao || undefined,
      nacionalidade: values.nacionalidade || undefined,
      telefone: values.telefone || undefined,
      telefoneSecundario: values.telefoneSecundario || undefined,
      residencia: values.residencia || undefined,
      enderecoCompleto: values.enderecoCompleto || undefined,
      indicadoPor: values.indicadoPor || undefined,
      inicioTratamento: values.inicioTratamento || undefined,
      terminoTratamento: values.terminoTratamento || undefined,
      interrupcaoTratamento: values.interrupcaoTratamento || undefined,
    };

    try {
      await cadastrarPaciente(user.token, payload);
      toast.success("Paciente cadastrado com sucesso!");
      form.reset();
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao cadastrar paciente.",
      );
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
