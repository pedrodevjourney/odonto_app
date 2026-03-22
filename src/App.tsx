import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardHomePage } from "@/pages/DashboardHomePage";
import { AgendaPage } from "@/pages/AgendaPage";
import { PacientesPage } from "@/pages/PacientesPage";
import { PagamentosPage } from "@/pages/PagamentosPage";
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
