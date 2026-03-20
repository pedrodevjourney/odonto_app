import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoOdonto from "@/assets/logo_odonto_sem_bg.png";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  paddingLeft: "38px",
  paddingRight: "14px",
  fontSize: "14px",
  color: "oklch(0.18 0.02 240)",
  background: "oklch(0.975 0.005 230)",
  border: "1.5px solid oklch(0.88 0.02 230)",
  borderRadius: "10px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "15px",
  height: "15px",
  color: "oklch(0.6 0.04 240)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "oklch(0.45 0.03 240)",
  marginBottom: "7px",
};

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "oklch(0.45 0.14 220)";
  e.target.style.boxShadow = "0 0 0 3px oklch(0.45 0.14 220 / 0.12)";
  e.target.style.background = "oklch(1 0 0)";
}

function handleBlurReset(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "oklch(0.88 0.02 230)";
  e.target.style.boxShadow = "none";
  e.target.style.background = "oklch(0.975 0.005 230)";
}

export function LoginForm() {
  const [apiError, setApiError] = useState("");
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
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "oklch(1 0 0)",
        borderRadius: "20px",
        boxShadow:
          "0 4px 6px oklch(0 0 0 / 0.04), 0 12px 40px oklch(0 0 0 / 0.08), 0 32px 80px oklch(0.18 0.05 240 / 0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, oklch(0.22 0.06 240) 0%, oklch(0.45 0.14 220) 50%, oklch(0.72 0.16 200) 100%)",
        }}
      />

      <div style={{ padding: "36px 44px 44px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <img
            src={logoOdonto}
            alt="Logo Clínica Odontológica"
            style={{
              width: "136px",
              height: "136px",
              objectFit: "contain",
              marginBottom: "16px",
            }}
          />
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              color: "oklch(0.14 0.02 240)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Bem-vindo de volta
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "oklch(0.55 0.02 240)",
              margin: "6px 0 0",
              lineHeight: 1.5,
            }}
          >
            Acesse o sistema de gestão odontológica
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem style={{ gap: 0 }}>
                  <label style={labelStyle}>E-mail</label>
                  <FormControl>
                    <div style={{ position: "relative" }}>
                      <svg
                        style={iconStyle}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        style={inputStyle}
                        onFocus={handleFocus}
                        {...field}
                        onBlur={(e) => {
                          handleBlurReset(e);
                          field.onBlur();
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage style={{ fontSize: "12px", marginTop: "5px" }} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem style={{ gap: 0 }}>
                  <label style={labelStyle}>Senha</label>
                  <FormControl>
                    <div style={{ position: "relative" }}>
                      <svg
                        style={iconStyle}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        style={inputStyle}
                        onFocus={handleFocus}
                        {...field}
                        onBlur={(e) => {
                          handleBlurReset(e);
                          field.onBlur();
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage style={{ fontSize: "12px", marginTop: "5px" }} />
                </FormItem>
              )}
            />

            {apiError && (
              <div
                role="alert"
                style={{
                  padding: "11px 14px",
                  borderRadius: "10px",
                  background: "oklch(0.97 0.02 25)",
                  border: "1px solid oklch(0.85 0.08 25)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "oklch(0.45 0.18 25)",
                  textAlign: "center",
                }}
              >
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                height: "46px",
                marginTop: "4px",
                border: "none",
                borderRadius: "10px",
                background: isSubmitting
                  ? "oklch(0.55 0.04 240)"
                  : "linear-gradient(135deg, oklch(0.22 0.06 240) 0%, oklch(0.30 0.10 235) 100%)",
                color: "oklch(0.95 0.01 220)",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.15s, transform 0.1s, box-shadow 0.15s",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 2px 8px oklch(0.18 0.06 240 / 0.35), 0 1px 2px oklch(0 0 0 / 0.2)",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  (e.target as HTMLButtonElement).style.opacity = "0.92";
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "0 6px 20px oklch(0.18 0.06 240 / 0.4), 0 2px 4px oklch(0 0 0 / 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "1";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 2px 8px oklch(0.18 0.06 240 / 0.35), 0 1px 2px oklch(0 0 0 / 0.2)";
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    style={{ width: "16px", height: "16px" }}
                    className="animate-spin"
                  />
                  Entrando...
                </>
              ) : (
                "Entrar no sistema"
              )}
            </button>
          </form>
        </Form>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid oklch(0.93 0.01 230)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <svg
            style={{
              width: "13px",
              height: "13px",
              color: "oklch(0.65 0.04 230)",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span style={{ fontSize: "12px", color: "oklch(0.62 0.03 230)" }}>
            Conexão protegida por SSL/TLS
          </span>
        </div>
      </div>
    </div>
  );
}
