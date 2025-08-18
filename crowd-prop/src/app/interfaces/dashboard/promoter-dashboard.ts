import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import { PromoterCampaignStatus } from "../promoter-campaign";
import { Advertiser } from "../campaign/promoter-campaign-details";

export interface PromoterStats {
  earningsThisWeek: number;
  earningsLastWeek: number;
  earningsPercentageChange: number;
  viewsToday: number;
  viewsYesterday: number;
  viewsPercentageChange: number;
  salesThisWeek: number;
  salesLastWeek: number;
  salesPercentageChange: number;
  activeCampaigns: number;
  pendingReviewCampaigns: number;
}

export interface PromoterActiveCampaign {
  id: string;
  title: string;
  mediaUrl?: string; // URL to the S3 campaign media (image/video)
  type: CampaignType;
  status: PromoterCampaignStatus;
  views: number;
  earnings: number;
  advertiser: Advertiser;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  requirements?: string[];
  minBudget?: number; // if consultant or seller type
  maxBudget?: number; // if consultant or seller type
  meetingPlan?: string; // if consultant or seller type
  meetingCount?: number; // if consultant or seller type
  meetingDone?: boolean; // if consultant or seller type
  cpv?: number; // if visibility type
  maxViews?: number; // if visibility type
  commissionPerSale?: number; // if salesman type
}

export interface PromoterSuggestedCampaign {
  id: string;
  title: string;
  mediaUrl?: string; // URL to the S3 campaign media (image/video)
  type: CampaignType;
  status: CampaignStatus;
  advertiser: Advertiser;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  requirements?: string[];
  minBudget?: number; //if consultant or seller type
  maxBudget?: number; //if consultant or seller type
  meetingPlan?: string; //if consultant or seller type
  meetingCount?: number; //if consultant or seller type
  cpv?: number; //if visibility type
  maxViews?: number; //if visibility type
  commissionPerSale?: number; //if salesman type
}

export interface PromoterTransaction {
  id: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED";
  date: string;
  campaign: string;
  campaignId: string;
  type:
    | "VIEW_EARNING"
    | "CAMPAIGN_FUNDING"
    | "SALESMAN_COMMISSION"
    | "MONTHLY_PAYOUT"
    | "DIRECT_PAYMENT";
  paymentMethod: "WALLET" | "BANK_TRANSFER";
  description?: string;
  estimatedPaymentDate?: string;
}

export interface PromoterMessage {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar?: string;
  isRead: boolean;
  threadId: string;
  senderType: "ADVERTISER" | "ADMIN" | "SYSTEM";
  campaignId?: string;
}

export interface PromoterWallet {
  viewEarnings: {
    currentBalance: string | number;
    pendingBalance: string | number;
    totalEarned: string | number;
    totalWithdrawn: string | number;
    lastPayoutDate?: string;
    nextPayoutDate?: string;
    minimumThreshold: string | number;
  };
  directEarnings: {
    totalEarned: string | number;
    totalPaid: string | number;
    pendingPayments: string | number;
    lastPaymentDate?: string;
  };
  totalLifetimeEarnings: string | number;
  totalAvailableBalance: string | number;
}

export interface PromoterDashboardData {
  stats: PromoterStats;
  activeCampaigns: PromoterActiveCampaign[];
  suggestedCampaigns: PromoterSuggestedCampaign[];
  recentTransactions: PromoterTransaction[];
  wallet: PromoterWallet;
}

// Request interfaces
export interface GetPromoterDashboardRequest {
  userId?: string; // Optional, can be derived from auth token
  includeStats?: boolean;
  includeCampaigns?: boolean;
  includeSuggestions?: boolean;
  includeTransactions?: boolean;
  includeWallet?: boolean;
  activeCampaignLimit?: number;
  suggestedCampaignLimit?: number;
  transactionLimit?: number;
}

// Response interfaces
export interface GetPromoterDashboardResponse {
  success: boolean;
  data: PromoterDashboardData;
  message?: string;
}

export interface GetPromoterStatsResponse {
  success: boolean;
  data: PromoterStats;
  message?: string;
}

export interface GetPromoterCampaignsResponse {
  success: boolean;
  data: {
    activeCampaigns: PromoterActiveCampaign[];
    totalActive: number;
    totalCompleted: number;
    totalPending: number;
  };
  message?: string;
}

export interface GetSuggestedCampaignsResponse {
  success: boolean;
  data: {
    campaigns: PromoterSuggestedCampaign[];
    total: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface GetPromoterTransactionsResponse {
  success: boolean;
  data: {
    transactions: PromoterTransaction[];
    total: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface GetPromoterMessagesResponse {
  success: boolean;
  data: {
    messages: PromoterMessage[];
    unreadCount: number;
    total: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface GetPromoterWalletResponse {
  success: boolean;
  data: PromoterWallet;
  message?: string;
}
