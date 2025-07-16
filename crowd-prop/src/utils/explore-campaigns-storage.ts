import {
  CampaignUnion,
  ExploreCampaignResponse,
} from "@/app/interfaces/campaign/explore-campaign";

const EXPLORE_CAMPAIGNS_STORAGE_KEY = "explore_campaigns_data";
const STORAGE_EXPIRY_HOURS = 1; // Cache for 1 hour

interface StoredExploreCampaigns {
  data: ExploreCampaignResponse;
  timestamp: number;
}

/**
 * Ensures numeric fields are properly converted to numbers
 * This is needed because localStorage stores everything as strings
 */
const ensureNumericFields = (campaign: CampaignUnion): CampaignUnion => {
  const normalized = { ...campaign };

  // Convert advertiser rating to number
  if (normalized.advertiser.rating) {
    normalized.advertiser.rating = Number(normalized.advertiser.rating);
  }

  // Convert campaign-specific numeric fields
  switch (normalized.type) {
    case "VISIBILITY":
      const visibilityNormalized = normalized as CampaignUnion & {
        maxViews?: number;
        currentViews?: number;
        cpv?: number;
        minFollowers?: number;
      };
      if (visibilityNormalized.maxViews)
        visibilityNormalized.maxViews = Number(visibilityNormalized.maxViews);
      if (visibilityNormalized.currentViews)
        visibilityNormalized.currentViews = Number(
          visibilityNormalized.currentViews
        );
      if (visibilityNormalized.cpv)
        visibilityNormalized.cpv = Number(visibilityNormalized.cpv);
      if (visibilityNormalized.minFollowers)
        visibilityNormalized.minFollowers = Number(
          visibilityNormalized.minFollowers
        );
      break;
    case "SALESMAN":
      const salesmanNormalized = normalized as CampaignUnion & {
        commissionPerSale?: number;
        minFollowers?: number;
      };
      if (salesmanNormalized.commissionPerSale)
        salesmanNormalized.commissionPerSale = Number(
          salesmanNormalized.commissionPerSale
        );
      if (salesmanNormalized.minFollowers)
        salesmanNormalized.minFollowers = Number(
          salesmanNormalized.minFollowers
        );
      break;
    case "CONSULTANT":
      const consultantNormalized = normalized as CampaignUnion & {
        minBudget?: number;
        maxBudget?: number;
        meetingCount?: number;
      };
      if (consultantNormalized.minBudget)
        consultantNormalized.minBudget = Number(consultantNormalized.minBudget);
      if (consultantNormalized.maxBudget)
        consultantNormalized.maxBudget = Number(consultantNormalized.maxBudget);
      if (consultantNormalized.meetingCount)
        consultantNormalized.meetingCount = Number(
          consultantNormalized.meetingCount
        );
      break;
    case "SELLER":
      const sellerNormalized = normalized as CampaignUnion & {
        minBudget?: number;
        maxBudget?: number;
        minFollowers?: number;
        meetingCount?: number;
      };
      if (sellerNormalized.minBudget)
        sellerNormalized.minBudget = Number(sellerNormalized.minBudget);
      if (sellerNormalized.maxBudget)
        sellerNormalized.maxBudget = Number(sellerNormalized.maxBudget);
      if (sellerNormalized.minFollowers)
        sellerNormalized.minFollowers = Number(sellerNormalized.minFollowers);
      if (sellerNormalized.meetingCount)
        sellerNormalized.meetingCount = Number(sellerNormalized.meetingCount);
      break;
  }

  return normalized;
};

export const exploreCampaignsStorage = {
  /**
   * Save explore campaigns data to localStorage
   */
  save: (data: ExploreCampaignResponse): void => {
    try {
      const storageData: StoredExploreCampaigns = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        EXPLORE_CAMPAIGNS_STORAGE_KEY,
        JSON.stringify(storageData)
      );
    } catch (error) {
      console.warn("Failed to save explore campaigns to localStorage:", error);
    }
  },

  /**
   * Get explore campaigns data from localStorage
   */
  get: (): ExploreCampaignResponse | null => {
    try {
      const stored = localStorage.getItem(EXPLORE_CAMPAIGNS_STORAGE_KEY);
      if (!stored) return null;

      const parsedData: StoredExploreCampaigns = JSON.parse(stored);
      const now = Date.now();
      const hoursPassed = (now - parsedData.timestamp) / (1000 * 60 * 60);

      // Check if data is expired
      if (hoursPassed > STORAGE_EXPIRY_HOURS) {
        localStorage.removeItem(EXPLORE_CAMPAIGNS_STORAGE_KEY);
        return null;
      }

      return parsedData.data;
    } catch (error) {
      console.warn("Failed to get explore campaigns from localStorage:", error);
      return null;
    }
  },
  /**
   * Get a specific campaign by ID from localStorage
   */
  getCampaignById: (campaignId: string): CampaignUnion | null => {
    const data = exploreCampaignsStorage.get();
    if (!data) return null;

    const campaign = data.campaigns.find(
      (campaign) => campaign.id === campaignId
    );
    if (!campaign) return null;

    // Ensure numeric fields are properly converted
    return ensureNumericFields(campaign);
  },

  /**
   * Clear explore campaigns data from localStorage
   */
  clear: (): void => {
    try {
      localStorage.removeItem(EXPLORE_CAMPAIGNS_STORAGE_KEY);
    } catch (error) {
      console.warn(
        "Failed to clear explore campaigns from localStorage:",
        error
      );
    }
  },

  /**
   * Check if there's valid cached data
   */
  hasValidCache: (): boolean => {
    return exploreCampaignsStorage.get() !== null;
  },
};
