import { useState, useEffect, useCallback } from "react";
import { advertiserService } from "@/services/advertiser.service";
import {
  CampaignAdvertiser,
  AdvertiserCampaignListRequest,
  ReviewPromoterApplicationRequest,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";
import {
  ADVERTISER_CAMPAIGN_MOCKS,
  getFilteredCampaigns,
  sortCampaigns,
} from "@/app/mocks/advertiser-campaign-mock";

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
  filters: {
    statuses: AdvertiserCampaignStatus[];
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
  const [filters, setFilters] = useState<{
    statuses: AdvertiserCampaignStatus[];
    types: CampaignType[];
  }>({
    statuses: [],
    types: [],
  });

  // Helper function to apply filters and sorting to mock data
  const getMockDataWithFilters = useCallback(
    (params?: AdvertiserCampaignListRequest) => {
      let campaigns = [
        ...ADVERTISER_CAMPAIGN_MOCKS.campaignListResponse.campaigns,
      ];

      // Apply filters
      if (params) {
        campaigns = getFilteredCampaigns(campaigns, {
          status: params.status,
          type: params.type,
          searchQuery: params.searchQuery,
          isPublic: params.isPublic,
        });

        // Apply sorting
        if (params.sortBy) {
          campaigns = sortCampaigns(
            campaigns,
            params.sortBy,
            params.sortOrder || "desc"
          );
        }
      }

      return {
        campaigns,
        pagination: ADVERTISER_CAMPAIGN_MOCKS.campaignListResponse.pagination,
        summary: ADVERTISER_CAMPAIGN_MOCKS.campaignListResponse.summary,
      };
    },
    [] // Remove dependencies to prevent infinite rerenders
  );

  const fetchCampaigns = useCallback(
    async (params?: AdvertiserCampaignListRequest) => {
      const requestParams = params || initialParams;
      try {
        setLoading(true);
        setError(null);
        const response = await advertiserService.getCampaignsList(
          requestParams
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

          const mockData = getMockDataWithFilters(requestParams);
          setCampaigns(mockData.campaigns);
          setPagination(mockData.pagination);
          setSummary(mockData.summary);
          setError("An error has occurred in the server. Please try again");
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [initialParams, retryCount, getMockDataWithFilters]
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

      // Campaign not found in local list, try to fetch from API
      try {
        console.log("Campaign not found in local list, fetching from API");
        const campaignData = await advertiserService.getCampaignById(
          campaignId
        );
        return campaignData;
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : `Campaign with ID ${campaignId} not found`
        );
      }
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

  const deleteCampaign = useCallback(
    async (campaignId: string) => {
      try {
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
        const [campaignsResult, filtersResult] = await Promise.allSettled([
          advertiserService.getCampaignsList(initialParams),
          advertiserService.getCampaignFilters(),
        ]); // Handle campaigns result
        if (campaignsResult.status === "fulfilled") {
          setCampaigns(campaignsResult.value.campaigns);
          setPagination(campaignsResult.value.pagination);
          setSummary(campaignsResult.value.summary);
          setRetryCount(0);
        } else {
          console.warn("Campaigns API not available, using mock data");
          const mockData = getMockDataWithFilters(initialParams);
          setCampaigns(mockData.campaigns);
          setPagination(mockData.pagination);
          setSummary(mockData.summary);
          setError("An error has occurred in the server. Please try again");
        }

        // Handle filters result - only set filters if they haven't been set yet
        if (filtersResult.status === "fulfilled") {
          setFilters(filtersResult.value);
        } else {
          console.warn("Filters API not available, using mock data");
          setFilters(ADVERTISER_CAMPAIGN_MOCKS.filters);
        }
      } catch (err) {
        console.error("Error during initialization:", err);
        // Fallback to all mock data
        const mockData = getMockDataWithFilters(initialParams);
        setCampaigns(mockData.campaigns);
        setPagination(mockData.pagination);
        setSummary(mockData.summary);
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
  }, [initialParams]); // Only depend on serializable initialParams

  return {
    campaigns,
    loading,
    error,
    pagination,
    summary,
    filters,
    refetch,
    getCampaignDetails,
    reviewApplication,
    deleteCampaign,
  };
};
