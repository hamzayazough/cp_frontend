import { CampaignType } from "@/app/enums/campaign-type";
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
      return `$${Number(campaign.cpv).toFixed(2)}`;
    case CampaignType.SALESMAN:
      return `${Number(campaign.commissionPerSale * 100).toFixed(0)}%`;
    case CampaignType.CONSULTANT:
      return `$${Number(campaign.minBudget).toLocaleString()} - $${Number(
        campaign.maxBudget
      ).toLocaleString()}`;
    case CampaignType.SELLER:
      return `$${Number(campaign.minBudget).toLocaleString()} - $${Number(
        campaign.maxBudget
      ).toLocaleString()}`;
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
