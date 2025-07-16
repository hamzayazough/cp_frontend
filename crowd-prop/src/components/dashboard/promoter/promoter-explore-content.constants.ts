import { CampaignType } from "@/app/enums/campaign-type";
import { EXPLORE_CAMPAIGN_MOCK } from "@/app/mocks/explore-campaign-mock";
import { CampaignUnion } from "@/app/interfaces/campaign/explore-campaign";

// Filter and sort options
export const TYPE_OPTIONS = [
  { value: "ALL", label: "All Types" },
  { value: CampaignType.VISIBILITY, label: "Visibility" },
  { value: CampaignType.SALESMAN, label: "Sales" },
  { value: CampaignType.CONSULTANT, label: "Consulting" },
  { value: CampaignType.SELLER, label: "Content & Sales" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "deadline", label: "Deadline Soon" },
  { value: "budget", label: "Highest Budget" },
  { value: "applicants", label: "Least Competition" },
] as const;

// Mock data for available campaigns (extract campaigns from response)
export const MOCK_CAMPAIGNS = EXPLORE_CAMPAIGN_MOCK.campaigns;

// Utility functions
export const getTypeColor = (type: string): string => {
  switch (type) {
    case CampaignType.VISIBILITY:
      return "bg-blue-100 text-blue-800";
    case CampaignType.SALESMAN:
      return "bg-green-100 text-green-800";
    case CampaignType.CONSULTANT:
      return "bg-purple-100 text-purple-800";
    case CampaignType.SELLER:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatBudgetInfo = (campaign: CampaignUnion): string => {
  switch (campaign.type) {
    case CampaignType.VISIBILITY:
      return `$${campaign.cpv} per 100 views`;
    case CampaignType.SALESMAN:
      return `${campaign.commissionPerSale * 100}% commission`;
    case CampaignType.CONSULTANT:
      return `$${campaign.minBudget} - $${campaign.maxBudget} budget`;
    case CampaignType.SELLER:
      return `$${campaign.minBudget} - $${campaign.maxBudget} budget`;
    default:
      return "Contact for details";
  }
};

export const getDaysLeft = (deadline: string): number => {
  const days = Math.ceil(
    (new Date(deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return days;
};

// Sorting function
export const sortCampaigns = (
  campaigns: CampaignUnion[],
  sortBy: string
): CampaignUnion[] => {
  return [...campaigns].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "budget":
        // Use maxBudget for campaigns that have it, or maxViews for visibility campaigns
        const aBudget =
          "maxBudget" in a ? a.maxBudget : "maxViews" in a ? a.maxViews : 0;
        const bBudget =
          "maxBudget" in b ? b.maxBudget : "maxViews" in b ? b.maxViews : 0;
        return bBudget - aBudget;
      case "applicants":
        // Since applicants don't exist in the new interface, sort by creation date as fallback
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });
};

// Filtering function
export const filterCampaigns = (
  campaigns: CampaignUnion[],
  searchTerm: string,
  typeFilter: string
): CampaignUnion[] => {
  return campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.advertiser.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      campaign.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = typeFilter === "ALL" || campaign.type === typeFilter;

    return matchesSearch && matchesType;
  });
};

// Combined filter and sort function
export const getFilteredAndSortedCampaigns = (
  searchTerm: string,
  typeFilter: string,
  sortBy: string
): CampaignUnion[] => {
  const filtered = filterCampaigns(MOCK_CAMPAIGNS, searchTerm, typeFilter);
  return sortCampaigns(filtered, sortBy);
};
