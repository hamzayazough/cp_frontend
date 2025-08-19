import { useState, useEffect, useCallback } from "react";
import { promoterService } from "@/services/promoter.service";
import { MOCK_CAMPAIGN_PROMOTERS } from "@/app/mocks/campaign-promoter-mock";
import { GetPromoterCampaignsRequest } from "@/app/interfaces/campaign/promoter-campaigns-request";
import { CampaignPromoter } from "@/app/interfaces/campaign/promoter-campaign-details";
import { savePromoterCampaignsToStorage } from "@/utils/promoter-campaigns-storage";

interface UsePromoterCampaignsState {
  campaigns: CampaignPromoter[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalCount: number;
  summary: {
    totalActive: number;
    totalPending: number;
    totalCompleted: number;
    totalEarnings: number;
    totalViews: number;
  };
}

interface UsePromoterCampaignsActions {
  fetchCampaigns: (params?: GetPromoterCampaignsRequest) => Promise<void>;
  refreshCampaigns: () => Promise<void>;
}

type UsePromoterCampaignsReturn = UsePromoterCampaignsState &
  UsePromoterCampaignsActions;

export function usePromoterCampaigns(
  initialParams?: GetPromoterCampaignsRequest
): UsePromoterCampaignsReturn {
  const [state, setState] = useState<UsePromoterCampaignsState>({
    campaigns: [],
    loading: true,
    error: null,
    page: 1,
    totalPages: 1,
    totalCount: 0,
    summary: {
      totalActive: 0,
      totalPending: 0,
      totalCompleted: 0,
      totalEarnings: 0,
      totalViews: 0,
    },
  });

  const [lastParams, setLastParams] = useState<GetPromoterCampaignsRequest>(
    initialParams || {}
  );

  const fetchCampaigns = useCallback(
    async (params: GetPromoterCampaignsRequest = {}) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      setLastParams(params);
      try {
        const response = await promoterService.getPromoterCampaigns(params);

        // Save campaigns to localStorage for details page access
        savePromoterCampaignsToStorage(response.campaigns);

        setState((prev) => ({
          ...prev,
          campaigns: response.campaigns,
          page: response.page,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          summary: response.summary,
          loading: false,
          error: null,
        }));
      } catch (error) {
        console.warn(
          "Failed to fetch promoter campaigns from API, using mock data:",
          error
        );

        // Calculate mock summary
        const mockSummary = {
          totalActive: MOCK_CAMPAIGN_PROMOTERS.filter(
            (c) => c.status === "ONGOING"
          ).length,
          totalPending: MOCK_CAMPAIGN_PROMOTERS.filter(
            (c) => c.status === "AWAITING_REVIEW"
          ).length,
          totalCompleted: MOCK_CAMPAIGN_PROMOTERS.filter(
            (c) => c.status === "COMPLETED"
          ).length,
          totalEarnings: MOCK_CAMPAIGN_PROMOTERS.reduce(
            (sum, c) => sum + c.earnings.totalEarned,
            0
          ),
          totalViews: MOCK_CAMPAIGN_PROMOTERS.reduce(
            (sum, c) => sum + (c.earnings.viewsGenerated || 0),
            0
          ),
        };

        // Filter mock data based on params
        let filteredCampaigns = [...MOCK_CAMPAIGN_PROMOTERS];

        if (params.searchTerm) {
          const searchLower = params.searchTerm.toLowerCase();
          filteredCampaigns = filteredCampaigns.filter(
            (campaign) =>
              campaign.title.toLowerCase().includes(searchLower) ||
              campaign.advertiser.companyName
                .toLowerCase()
                .includes(searchLower) ||
              campaign.description.toLowerCase().includes(searchLower)
          );
        }

        if (params.status && params.status.length > 0) {
          filteredCampaigns = filteredCampaigns.filter((campaign) =>
            params.status!.includes(campaign.status)
          );
        }

        if (params.type && params.type.length > 0) {
          filteredCampaigns = filteredCampaigns.filter((campaign) =>
            params.type!.includes(campaign.type)
          );
        } // Apply sorting
        if (params.sortBy) {
          filteredCampaigns.sort((a, b) => {
            let aValue: string | number, bValue: string | number;

            switch (params.sortBy) {
              case "newest":
                aValue = new Date(a.campaign.createdAt).getTime();
                bValue = new Date(b.campaign.createdAt).getTime();
                break;
              case "deadline":
                aValue = new Date(a.campaign.deadline).getTime();
                bValue = new Date(b.campaign.deadline).getTime();
                break;
              case "earnings":
                aValue = a.earnings.totalEarned;
                bValue = b.earnings.totalEarned;
                break;
              case "title":
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
              default:
                return 0;
            }

            const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return params.sortOrder === "desc" ? -result : result;
          });
        }

        // Apply pagination
        const page = params.page || 1;
        const limit = params.limit || 10;
        const startIndex = (page - 1) * limit;
        const paginatedCampaigns = filteredCampaigns.slice(
          startIndex,
          startIndex + limit
        );

        // Save mock campaigns to localStorage for details page access
        savePromoterCampaignsToStorage(filteredCampaigns);

        setState((prev) => ({
          ...prev,
          campaigns: paginatedCampaigns,
          page,
          totalPages: Math.ceil(filteredCampaigns.length / limit),
          totalCount: filteredCampaigns.length,
          summary: mockSummary,
          loading: false,
          error: null,
        }));
      }
    },
    []
  );

  const refreshCampaigns = useCallback(async () => {
    await fetchCampaigns(lastParams);
  }, [lastParams]); // Only depend on lastParams, not fetchCampaigns

  useEffect(() => {
    fetchCampaigns(initialParams);
  }, [initialParams]); // Only depend on serializable initialParams

  return {
    ...state,
    fetchCampaigns,
    refreshCampaigns,
  };
}
