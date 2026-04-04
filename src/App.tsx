import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardHomePage } from "@/features/dashboard/pages/DashboardHomePage";
import { AgendaPage } from "@/features/agenda/pages/AgendaPage";
import { PacientesPage } from "@/features/pacientes/pages/PacientesPage";
import { ProntuarioPage } from "@/features/pacientes/pages/ProntuarioPage";
import { PagamentosPage } from "@/features/pagamentos/pages/PagamentosPage";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="pacientes" element={<PacientesPage />} />
            <Route path="pacientes/:id" element={<ProntuarioPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="pagamentos" element={<PagamentosPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}
