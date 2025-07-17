import { CampaignPromoter } from "@/app/interfaces/campaign/promoter-campaign-details";

const STORAGE_KEY = "promoter_campaigns_data";
const EXPIRY_HOURS = 1; // Cache for 1 hour

interface StoredPromoterCampaignsData {
  campaigns: CampaignPromoter[];
  timestamp: number;
  expiresAt: number;
}

/**
 * Save promoter campaigns data to localStorage with expiry
 */
export function savePromoterCampaignsToStorage(
  campaigns: CampaignPromoter[]
): void {
  try {
    const now = Date.now();
    const expiresAt = now + EXPIRY_HOURS * 60 * 60 * 1000;

    // Normalize numeric fields to ensure they're numbers
    const normalizedCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      earnings: {
        ...campaign.earnings,
        totalEarned: Number(campaign.earnings.totalEarned) || 0,
        viewsGenerated: Number(campaign.earnings.viewsGenerated) || 0,
      }, // Normalize budget fields if they exist
      campaign: {
        ...campaign.campaign,
        ...("minBudget" in campaign.campaign && {
          minBudget:
            Number((campaign.campaign as { minBudget: unknown }).minBudget) ||
            0,
          maxBudget:
            Number((campaign.campaign as { maxBudget: unknown }).maxBudget) ||
            0,
        }),
        ...("commissionRate" in campaign.campaign && {
          commissionRate:
            Number(
              (campaign.campaign as { commissionRate: unknown }).commissionRate
            ) || 0,
        }),
        ...("cpv" in campaign.campaign && {
          cpv: Number((campaign.campaign as { cpv: unknown }).cpv) || 0,
        }),
        ...("fixedPrice" in campaign.campaign && {
          fixedPrice:
            Number((campaign.campaign as { fixedPrice: unknown }).fixedPrice) ||
            0,
        }),
      },
      advertiser: {
        ...campaign.advertiser,
        rating: Number(campaign.advertiser.rating) || 0,
      },
    }));

    const data: StoredPromoterCampaignsData = {
      campaigns: normalizedCampaigns,
      timestamp: now,
      expiresAt,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log(`Saved ${campaigns.length} promoter campaigns to localStorage`);
  } catch (error) {
    console.warn("Failed to save promoter campaigns to localStorage:", error);
  }
}

/**
 * Get promoter campaigns data from localStorage
 */
export function getPromoterCampaignsFromStorage(): CampaignPromoter[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data: StoredPromoterCampaignsData = JSON.parse(stored);
    const now = Date.now();

    // Check if data has expired
    if (now > data.expiresAt) {
      console.log("Promoter campaigns data has expired, clearing cache");
      clearPromoterCampaignsStorage();
      return [];
    }

    console.log(
      `Retrieved ${data.campaigns.length} promoter campaigns from localStorage`
    );
    return data.campaigns;
  } catch (error) {
    console.warn(
      "Failed to retrieve promoter campaigns from localStorage:",
      error
    );
    clearPromoterCampaignsStorage();
    return [];
  }
}

/**
 * Get a specific campaign by ID from localStorage
 */
export function getPromoterCampaignById(
  campaignId: string
): CampaignPromoter | null {
  const campaigns = getPromoterCampaignsFromStorage();
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (campaign) {
    console.log(`Found campaign ${campaignId} in localStorage`);
  } else {
    console.log(`Campaign ${campaignId} not found in localStorage`);
  }

  return campaign || null;
}

/**
 * Clear promoter campaigns data from localStorage
 */
export function clearPromoterCampaignsStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Cleared promoter campaigns from localStorage");
  } catch (error) {
    console.warn(
      "Failed to clear promoter campaigns from localStorage:",
      error
    );
  }
}

/**
 * Check if promoter campaigns data exists and is not expired
 */
export function hasValidPromoterCampaignsData(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const data: StoredPromoterCampaignsData = JSON.parse(stored);
    const now = Date.now();
    return now <= data.expiresAt && data.campaigns.length > 0;
  } catch {
    return false;
  }
}
