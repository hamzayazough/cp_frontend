import { useState, useEffect, useCallback } from "react";
import { promoterService } from "@/services/promoter.service";
import { ExploreCampaignRequest } from "@/app/interfaces/campaign/explore-campaign-request";
import { CampaignUnion } from "@/app/interfaces/campaign/explore-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { EXPLORE_CAMPAIGN_MOCK } from "@/app/mocks/explore-campaign-mock";
import { exploreCampaignsStorage } from "@/utils/explore-campaigns-storage";

interface UseExploreCampaignsParams {
  searchTerm?: string;
  typeFilter?: string;
  sortBy?: string;
}

interface UseExploreCampaignsReturn {
  campaigns: CampaignUnion[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  refetch: () => Promise<void>;
}

export const useExploreCampaigns = (
  params: UseExploreCampaignsParams = {}
): UseExploreCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<CampaignUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [retryCount, setRetryCount] = useState(0);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert UI params to API params
      const requestParams: ExploreCampaignRequest = {
        searchTerm: params.searchTerm || undefined,
        typeFilter:
          params.typeFilter && params.typeFilter !== "ALL"
            ? [params.typeFilter as CampaignType]
            : undefined,
        sortBy:
          (params.sortBy as "newest" | "deadline" | "budget" | "applicants") ||
          "newest",
        page: 1,
        limit: 50, // Get all campaigns for now
      };
      const response = await promoterService.getExploreCampaigns(requestParams);

      // Save the response to localStorage for the campaign details page
      exploreCampaignsStorage.save(response);

      setCampaigns(response.campaigns);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      });
      setRetryCount(0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch campaigns";
      console.error("Error fetching explore campaigns:", err);

      // Check if it's an API error and we haven't retried yet
      const isApiError =
        err instanceof Error &&
        (err.message.includes("404") ||
          err.message.includes("500") ||
          err.message.includes("Cannot POST") ||
          err.message.includes("Failed to fetch"));

      if (isApiError && retryCount < 1) {
        console.warn("API not available, falling back to mock data");
        setRetryCount((prev) => prev + 1); // Use mock data as fallback
        const mockResponse = EXPLORE_CAMPAIGN_MOCK;

        // Save mock data to localStorage as well
        exploreCampaignsStorage.save(mockResponse);

        setCampaigns(mockResponse.campaigns);
        setPagination({
          page: mockResponse.page,
          totalPages: mockResponse.totalPages,
          totalCount: mockResponse.totalCount,
        });
        setError("Server is currently unavailable. Showing demo data.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [params.searchTerm, params.typeFilter, params.sortBy, retryCount]);

  const refetch = useCallback(async () => {
    await fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    pagination,
    refetch,
  };
};
