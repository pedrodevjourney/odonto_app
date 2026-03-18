import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { login } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email({ message: "Informe um e-mail válido" }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [apiError, setApiError] = useState<string>("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: LoginFormValues) {
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

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-2 pt-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-sm">
          <Stethoscope className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-semibold">
          Acesso ao Sistema
        </CardTitle>
        <CardDescription className="mt-1 text-sm">
          Clínica Odontológica
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-5 px-8 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className="text-sm font-medium">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@clinica.com"
                      autoComplete="email"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className="text-sm font-medium">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
              >
                {apiError}
              </p>
            )}
          </CardContent>

          <CardFooter className="px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="h-10 w-full text-sm font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
