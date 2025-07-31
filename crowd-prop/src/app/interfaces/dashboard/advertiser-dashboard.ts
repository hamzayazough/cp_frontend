import { CampaignType } from "@/app/enums/campaign-type";
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "../transaction";

export enum AdvertiserCampaignStatus {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  WAITING_FOR_APPLICATIONS = "WAITING_FOR_APPLICATIONS",
  REVIEWING_APPLICATIONS = "REVIEWING_APPLICATIONS",
  PENDING_PROMOTER = "PENDING_PROMOTER",
}
export interface AdvertiserStats {
  spendingThisWeek: number;
  spendingLastWeek: number;
  spendingPercentageChange: number;
  spendingTotal: number;
  viewsToday: number;
  viewsYesterday: number;
  viewsPercentageChange: number;
  viewsTotal: number;
  conversionsThisWeek: number;
  conversionsLastWeek: number;
  conversionsPercentageChange: number;
  activeCampaigns: number;
  pendingApprovalCampaigns: number;
}

export interface AdvertiserActiveCampaign {
  id: string;
  title: string;
  type: CampaignType;
  status: AdvertiserCampaignStatus;
  views: number;
  spent: number;
  applications: number;
  conversions: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertiserTransaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  campaign: string;
  campaignId: string;
  promoter?: string;
  promoterId?: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  description?: string;
  estimatedDeliveryDate?: string;
}

export interface AdvertiserMessage {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar?: string;
  isRead: boolean;
  threadId: string;
  senderType: "PROMOTER" | "ADMIN" | "SYSTEM";
  campaignId?: string;
}

export interface AdvertiserWallet {
  balance: {
    currentBalance: string | number;
    pendingCharges: string | number;
    totalSpent: string | number;
    totalDeposited: string | number;
    lastDepositDate?: string;
    minimumBalance: string | number;
  };
  campaignBudgets: {
    totalAllocated: string | number;
    totalUsed: string | number;
    pendingPayments: string | number;
    lastPaymentDate?: string;
  };
  totalLifetimeSpent: string | number;
  totalAvailableBalance: string | number;
}

export interface AdvertiserDashboardData {
  stats: AdvertiserStats;
  activeCampaigns: AdvertiserActiveCampaign[];
  recentTransactions: AdvertiserTransaction[];
  recentMessages: AdvertiserMessage[];
  wallet: AdvertiserWallet;
}

// Request interfaces
export interface GetAdvertiserDashboardRequest {
  userId?: string; // Optional, can be derived from auth token
  includeStats?: boolean;
  includeCampaigns?: boolean;
  includeRecommendations?: boolean;
  includeTransactions?: boolean;
  includeMessages?: boolean;
  includeWallet?: boolean;
  activeCampaignLimit?: number;
  transactionLimit?: number;
  messageLimit?: number;
}

// Response interfaces
export interface GetAdvertiserDashboardResponse {
  success: boolean;
  data: AdvertiserDashboardData;
  message?: string;
}

export interface GetAdvertiserStatsResponse {
  success: boolean;
  data: AdvertiserStats;
  message?: string;
}

export interface GetAdvertiserCampaignsResponse {
  success: boolean;
  data: {
    activeCampaigns: AdvertiserActiveCampaign[];
    totalActive: number;
    totalCompleted: number;
    totalPending: number;
  };
  message?: string;
}

export interface GetAdvertiserTransactionsResponse {
  success: boolean;
  data: {
    transactions: AdvertiserTransaction[];
    total: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface GetAdvertiserMessagesResponse {
  success: boolean;
  data: {
    messages: AdvertiserMessage[];
    unreadCount: number;
    total: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface GetAdvertiserWalletResponse {
  success: boolean;
  data: AdvertiserWallet;
  message?: string;
}
