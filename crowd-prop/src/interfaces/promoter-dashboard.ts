import { CampaignType } from "@/app/enums/campaign-type";

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
  type: CampaignType;
  status: "ONGOING" | "AWAITING_REVIEW" | "COMPLETED" | "PAUSED";
  views: number;
  earnings: number;
  advertiser: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromoterSuggestedCampaign {
  id: string;
  title: string;
  type: CampaignType;
  cpv?: number; // Cost per view for VISIBILITY campaigns
  commission?: number; // Commission percentage for SALESMAN campaigns
  fixedFee?: number; // Fixed fee for CONSULTANT campaigns
  budget?: number;
  advertiser: string;
  tags: string[];
  description: string;
  requirements: string[];
  estimatedEarnings: number;
  applicationDeadline: string;
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
    | "CONSULTANT_PAYMENT"
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
  recentMessages: PromoterMessage[];
  wallet: PromoterWallet;
}

// Request interfaces
export interface GetPromoterDashboardRequest {
  userId?: string; // Optional, can be derived from auth token
  includeStats?: boolean;
  includeCampaigns?: boolean;
  includeSuggestions?: boolean;
  includeTransactions?: boolean;
  includeMessages?: boolean;
  includeWallet?: boolean;
  activeCampaignLimit?: number;
  suggestedCampaignLimit?: number;
  transactionLimit?: number;
  messageLimit?: number;
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
