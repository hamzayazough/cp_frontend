import { useState, useEffect, useCallback } from "react";
import { advertiserService } from "@/services/advertiser.service";
import { advertiserPaymentService } from "@/services/advertiser-payment.service";
import { AdvertiserDashboardData } from "@/app/interfaces/dashboard/advertiser-dashboard";

interface UseAdvertiserDashboardReturn {
  data: AdvertiserDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addFunds: (amount: number) => Promise<{ success: boolean; message: string }>;
  pauseCampaign: (
    campaignId: string
  ) => Promise<{ success: boolean; message: string }>;
  resumeCampaign: (
    campaignId: string
  ) => Promise<{ success: boolean; message: string }>;
  contactPromoter: (
    promoterId: string,
    message: string
  ) => Promise<{ success: boolean; message: string }>;
}

export const useAdvertiserDashboard = (): UseAdvertiserDashboardReturn => {
  const [data, setData] = useState<AdvertiserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching advertiser dashboard data...");
      const dashboardData = await advertiserService.getDashboardData();
      console.log("Dashboard data fetched successfully:", dashboardData);
      setData(dashboardData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFunds = async (amount: number) => {
    try {
      const result = await advertiserPaymentService.addFunds({ amount });
      if (result.success) {
        // Refetch data to update wallet balance
        await fetchData();
      }
      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to add funds"
      );
    }
  };

  const pauseCampaign = async (campaignId: string) => {
    try {
      const result = await advertiserService.pauseCampaign(campaignId);
      if (result.success) {
        // Refetch data to update campaign status
        await fetchData();
      }
      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to pause campaign"
      );
    }
  };

  const resumeCampaign = async (campaignId: string) => {
    try {
      const result = await advertiserService.resumeCampaign(campaignId);
      if (result.success) {
        // Refetch data to update campaign status
        await fetchData();
      }
      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to resume campaign"
      );
    }
  };

  const contactPromoter = async (promoterId: string, message: string) => {
    try {
      const result = await advertiserService.contactPromoter(
        promoterId,
        message
      );
      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to contact promoter"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Remove fetchData dependency to prevent infinite loop

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    addFunds,
    pauseCampaign,
    resumeCampaign,
    contactPromoter,
  };
};
