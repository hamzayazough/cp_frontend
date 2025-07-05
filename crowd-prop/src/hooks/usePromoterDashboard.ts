import { useState, useEffect } from "react";
import { promoterService } from "@/services/promoter.service";
import { PromoterDashboardData } from "@/interfaces/promoter-dashboard";

interface UsePromoterDashboardReturn {
  data: PromoterDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  requestPayout: (
    amount?: number
  ) => Promise<{ success: boolean; message: string }>;
  useTemplate: boolean;
  setUseTemplate: (useTemplate: boolean) => void;
}

export const usePromoterDashboard = (): UsePromoterDashboardReturn => {
  const [data, setData] = useState<PromoterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useTemplate, setUseTemplate] = useState(false);

  const fetchData = async () => {
    if (useTemplate) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dashboardData = await promoterService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch dashboard data";

      // Check if it's a 404 error (API not implemented yet)
      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        setError(
          "API endpoints are not yet implemented. Please set up the backend API first."
        );
        setUseTemplate(true);
      } else {
        setError(errorMessage);
      }

      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async (amount?: number) => {
    try {
      const result = await promoterService.requestPayout(amount);
      if (result.success) {
        // Refetch data to update wallet balance
        await fetchData();
      }
      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to request payout"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    requestPayout,
    useTemplate,
    setUseTemplate,
  };
};
