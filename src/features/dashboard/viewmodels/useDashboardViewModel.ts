import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { buscarDashboard } from "../services/dashboardService";
import type { DashboardResponse } from "../types/dashboard";

export interface DashboardViewModel {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardViewModel(): DashboardViewModel {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await buscarDashboard(user.token);
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar dashboard";

      if (message.includes("401") || message.includes("Unauthorized")) {
        navigate("/login", { replace: true });
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
