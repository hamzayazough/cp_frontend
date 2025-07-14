import { useState, useEffect, useCallback } from "react";
import { advertiserService } from "@/services/advertiser.service";
import {
  CampaignAdvertiser,
  AdvertiserCampaignListRequest,
  AdvertiserDashboardSummary,
  PromoterApplicationInfo,
  ReviewPromoterApplicationRequest,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";

interface UseAdvertiserCampaignsReturn {
  campaigns: CampaignAdvertiser[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalActiveCampaigns: number;
    totalCompletedCampaigns: number;
    totalSpentThisMonth: number;
    totalAllocatedBudget: number;
    totalRemainingBudget: number;
  };
  dashboardSummary: AdvertiserDashboardSummary | null;
  filters: {
    statuses: CampaignStatus[];
    types: CampaignType[];
  };
  refetch: () => Promise<void>;
  getCampaignDetails: (campaignId: string) => Promise<CampaignAdvertiser>;
  getCampaignApplications: (
    campaignId: string
  ) => Promise<PromoterApplicationInfo[]>;
  reviewApplication: (
    params: ReviewPromoterApplicationRequest
  ) => Promise<{ success: boolean; message: string }>;
  deleteCampaign: (
    campaignId: string
  ) => Promise<{ success: boolean; message: string }>;
  duplicateCampaign: (
    campaignId: string
  ) => Promise<{ success: boolean; message: string }>;
  updateCampaign: (
    campaignId: string,
    data: Partial<CampaignAdvertiser>
  ) => Promise<{ success: boolean; message: string }>;
}

export const useAdvertiserCampaigns = (
  initialParams?: AdvertiserCampaignListRequest
): UseAdvertiserCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<CampaignAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [summary, setSummary] = useState({
    totalActiveCampaigns: 0,
    totalCompletedCampaigns: 0,
    totalSpentThisMonth: 0,
    totalAllocatedBudget: 0,
    totalRemainingBudget: 0,
  });
  const [dashboardSummary, setDashboardSummary] =
    useState<AdvertiserDashboardSummary | null>(null);
  const [filters, setFilters] = useState<{
    statuses: CampaignStatus[];
    types: CampaignType[];
  }>({
    statuses: [],
    types: [],
  });

  const fetchCampaigns = useCallback(
    async (params?: AdvertiserCampaignListRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await advertiserService.getCampaignsList(
          params || initialParams
        );

        setCampaigns(response.campaigns);
        setPagination(response.pagination);
        setSummary(response.summary);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch campaigns";
        setError(errorMessage);
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    },
    [initialParams]
  );

  const fetchDashboardSummary = useCallback(async () => {
    try {
      const summary = await advertiserService.getDashboardSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const filtersData = await advertiserService.getCampaignFilters();
      setFilters(filtersData);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  }, []);

  const getCampaignDetails = useCallback(
    async (campaignId: string): Promise<CampaignAdvertiser> => {
      try {
        return await advertiserService.getCampaignDetails(campaignId);
      } catch (err) {
        throw new Error(
          err instanceof Error
            ? err.message
            : "Failed to fetch campaign details"
        );
      }
    },
    []
  );

  const getCampaignApplications = useCallback(
    async (campaignId: string): Promise<PromoterApplicationInfo[]> => {
      try {
        return await advertiserService.getCampaignApplications(campaignId);
      } catch (err) {
        throw new Error(
          err instanceof Error
            ? err.message
            : "Failed to fetch campaign applications"
        );
      }
    },
    []
  );

  const reviewApplication = useCallback(
    async (params: ReviewPromoterApplicationRequest) => {
      try {
        const result = await advertiserService.reviewPromoterApplication(
          params
        );
        if (result.success) {
          // Refresh campaigns to update application status
          await fetchCampaigns();
        }
        return result;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to review application"
        );
      }
    },
    [fetchCampaigns]
  );

  const deleteCampaign = useCallback(
    async (campaignId: string) => {
      try {
        const result = await advertiserService.deleteCampaign(campaignId);
        if (result.success) {
          // Refresh campaigns list
          await fetchCampaigns();
        }
        return result;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to delete campaign"
        );
      }
    },
    [fetchCampaigns]
  );

  const duplicateCampaign = useCallback(
    async (campaignId: string) => {
      try {
        const result = await advertiserService.duplicateCampaign(campaignId);
        if (result.success) {
          // Refresh campaigns list
          await fetchCampaigns();
        }
        return result;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to duplicate campaign"
        );
      }
    },
    [fetchCampaigns]
  );

  const updateCampaign = useCallback(
    async (campaignId: string, data: Partial<CampaignAdvertiser>) => {
      try {
        const result = await advertiserService.updateCampaign(campaignId, data);
        if (result.success) {
          // Refresh campaigns list
          await fetchCampaigns();
        }
        return result;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to update campaign"
        );
      }
    },
    [fetchCampaigns]
  );

  useEffect(() => {
    fetchCampaigns();
    fetchDashboardSummary();
    fetchFilters();
  }, [fetchCampaigns, fetchDashboardSummary, fetchFilters]);

  return {
    campaigns,
    loading,
    error,
    pagination,
    summary,
    dashboardSummary,
    filters,
    refetch: fetchCampaigns,
    getCampaignDetails,
    getCampaignApplications,
    reviewApplication,
    deleteCampaign,
    duplicateCampaign,
    updateCampaign,
  };
};
