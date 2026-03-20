import LottieLib from "lottie-react";
const Lottie = (LottieLib as any).default ?? LottieLib;
import loginAnimation from "@/assets/animations/login_odonto.json";
import { LoginForm } from "@/components/LoginForm";

export function LoginPage() {
  return (
    <main
      className="flex min-h-screen flex-row overflow-hidden"
      style={{ background: "oklch(0.97 0.005 230)" }}
    >
      <div
        className="relative hidden flex-col items-center justify-center overflow-hidden md:flex"
        style={{
          width: "40%",
          flexShrink: 0,
          background:
            "linear-gradient(160deg, oklch(0.22 0.06 240) 0%, oklch(0.17 0.07 250) 40%, oklch(0.14 0.05 255) 100%)",
          boxShadow:
            "20px 0 60px 0 oklch(0 0 0 / 0.35), 6px 0 20px 0 oklch(0 0 0 / 0.20)",
          zIndex: 2,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: "overlay",
          }}
        />

        <div
          className="pointer-events-none absolute"
          style={{
            top: "-120px",
            right: "-80px",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            border: "1px solid oklch(1 0 0 / 0.06)",
            background:
              "radial-gradient(circle, oklch(1 0 0 / 0.04) 0%, transparent 70%)",
          }}
        />

        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-60px",
            left: "-40px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "1px solid oklch(1 0 0 / 0.05)",
            background:
              "radial-gradient(circle, oklch(0.7 0.12 230 / 0.08) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute left-0 right-0 top-0"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.72 0.16 220 / 0.6) 40%, oklch(0.82 0.14 200 / 0.8) 60%, transparent 100%)",
          }}
        />

        <div className="relative flex flex-col items-center px-10">
          <div
            style={{
              width: "min(320px, 80%)",
              filter:
                "drop-shadow(0 20px 60px oklch(0.5 0.15 220 / 0.25)) drop-shadow(0 4px 16px oklch(0 0 0 / 0.3))",
            }}
          >
            <Lottie animationData={loginAnimation} loop />
          </div>

          <div className="mt-6 text-center">
            <p
              className="text-lg font-semibold leading-tight"
              style={{ color: "oklch(0.95 0.02 230)" }}
            >
              Gestão Odontológica
            </p>
            <p
              className="mt-1.5 text-sm font-normal"
              style={{ color: "oklch(0.65 0.04 230)" }}
            >
              Simples, preciso e profissional.
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-6 py-12 md:py-0"
        style={{
          background: "oklch(0.97 0.005 230)",
          zIndex: 1,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, oklch(0.72 0.08 220 / 0.04) 0%, transparent 60%), radial-gradient(circle at 20% 80%, oklch(0.72 0.06 250 / 0.03) 0%, transparent 50%)",
          }}
        />

        <div className="relative w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
