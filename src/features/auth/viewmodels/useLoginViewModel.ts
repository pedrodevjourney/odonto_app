import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "@/features/auth/services/authService";
import { useAuth } from "@/features/auth/contexts/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email({ message: "Informe um e-mail válido" }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginViewModel() {
  const [apiError, setApiError] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  async function handleSubmit(values: LoginFormValues) {
    setApiError("");
    try {
      const { token } = await login(values);
      setToken(token, values.email);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Tente novamente.",
      );
    }
  }

  return {
    form,
    apiError,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(handleSubmit),
  };
}
