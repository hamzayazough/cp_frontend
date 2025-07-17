import { useState, useEffect, useCallback } from "react";
import { advertiserService } from "@/services/advertiser.service";
import {
  CampaignAdvertiser,
  AdvertiserCampaignListRequest,
  AdvertiserDashboardSummary,
  ReviewPromoterApplicationRequest,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import { ADVERTISER_CAMPAIGN_MOCKS } from "@/app/mocks/advertiser-campaign-mock";

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

  optimisticDeleteCampaign: (campaignId: string) => void;
  optimisticUpdateCampaignStatus: (
    campaignId: string,
    status: CampaignStatus
  ) => void;
}

export const useAdvertiserCampaigns = (
  initialParams?: AdvertiserCampaignListRequest
): UseAdvertiserCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<CampaignAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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
        setRetryCount(0);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch campaigns";

        console.error("Error fetching campaigns:", err);

        const isApiError =
          err instanceof Error &&
          (err.message.includes("404") ||
            err.message.includes("500") ||
            err.message.includes("Cannot POST") ||
            err.message.includes("Failed to fetch"));
        if (isApiError && retryCount < 1) {
          console.warn("API not available, falling back to mock data");
          setRetryCount((prev) => prev + 1);

          const mockResponse = ADVERTISER_CAMPAIGN_MOCKS.campaignListResponse;
          setCampaigns(mockResponse.campaigns);
          setPagination(mockResponse.pagination);
          setSummary(mockResponse.summary);
          setError("An error has occurred in the server. Please try again");
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [initialParams, retryCount]
  );
  const refetch = useCallback(async () => {
    await fetchCampaigns(initialParams);
  }, [fetchCampaigns, initialParams]);
  const getCampaignDetails = useCallback(
    async (campaignId: string): Promise<CampaignAdvertiser> => {
      // Find campaign in the already loaded campaigns list
      const campaign = campaigns.find((c) => c.id === campaignId);

      if (campaign) {
        return Promise.resolve(campaign);
      }

      // Campaign not found - wait for campaigns to load or indicates data inconsistency
      throw new Error(
        `Campaign with ID ${campaignId} not found in campaigns list`
      );
    },
    [campaigns]
  );

  const reviewApplication = useCallback(
    async (params: ReviewPromoterApplicationRequest) => {
      try {
        const result = await advertiserService.reviewPromoterApplication(
          params
        );
        if (result.success) {
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

  // Add optimistic update functions
  const optimisticDeleteCampaign = useCallback((campaignId: string) => {
    setCampaigns((prev) =>
      prev.filter((campaign) => campaign.id !== campaignId)
    );
  }, []);

  const optimisticUpdateCampaignStatus = useCallback(
    (campaignId: string, status: CampaignStatus) => {
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, status } : campaign
        )
      );
    },
    []
  );

  const deleteCampaign = useCallback(
    async (campaignId: string) => {
      try {
        // Optimistic update first
        optimisticDeleteCampaign(campaignId);

        const result = await advertiserService.deleteCampaign(campaignId);
        if (!result.success) {
          // Revert optimistic update if API call fails
          await fetchCampaigns();
        }
        return result;
      } catch (err) {
        // Revert optimistic update on error
        await fetchCampaigns();
        throw new Error(
          err instanceof Error ? err.message : "Failed to delete campaign"
        );
      }
    },
    [fetchCampaigns, optimisticDeleteCampaign]
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
    let mounted = true;

    const initializeData = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        setError(null);

        // Try to fetch real data first
        const [campaignsResult, dashboardResult, filtersResult] =
          await Promise.allSettled([
            advertiserService.getCampaignsList(initialParams),
            advertiserService.getDashboardSummary(),
            advertiserService.getCampaignFilters(),
          ]); // Handle campaigns result
        if (campaignsResult.status === "fulfilled") {
          setCampaigns(campaignsResult.value.campaigns);
          setPagination(campaignsResult.value.pagination);
          setSummary(campaignsResult.value.summary);
          setRetryCount(0);
        } else {
          console.warn("Campaigns API not available, using mock data");
          const mockResponse = ADVERTISER_CAMPAIGN_MOCKS.campaignListResponse;
          setCampaigns(mockResponse.campaigns);
          setPagination(mockResponse.pagination);
          setSummary(mockResponse.summary);
          setError("An error has occurred in the server. Please try again");
        }

        // Handle dashboard summary result
        if (dashboardResult.status === "fulfilled") {
          setDashboardSummary(dashboardResult.value);
        } else {
          console.warn("Dashboard API not available, using mock data");
          setDashboardSummary(ADVERTISER_CAMPAIGN_MOCKS.dashboardSummary);
        }

        // Handle filters result
        if (filtersResult.status === "fulfilled") {
          setFilters(filtersResult.value);
        } else {
          console.warn("Filters API not available, using mock data");
          setFilters(ADVERTISER_CAMPAIGN_MOCKS.filters);
        }
      } catch (err) {
        console.error("Error during initialization:", err);
        // Fallback to all mock data
        const mockResponse = ADVERTISER_CAMPAIGN_MOCKS.campaignListResponse;
        setCampaigns(mockResponse.campaigns);
        setPagination(mockResponse.pagination);
        setSummary(mockResponse.summary);
        setDashboardSummary(ADVERTISER_CAMPAIGN_MOCKS.dashboardSummary);
        setFilters(ADVERTISER_CAMPAIGN_MOCKS.filters);
        setError("An error has occurred in the server. Please try again");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeData();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  return {
    campaigns,
    loading,
    error,
    pagination,
    summary,
    dashboardSummary,
    filters,
    refetch,
    getCampaignDetails,
    reviewApplication,
    deleteCampaign,
    duplicateCampaign,
    updateCampaign,
    optimisticDeleteCampaign,
    optimisticUpdateCampaignStatus,
  };
};
