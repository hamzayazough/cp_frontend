import { httpService } from "./http.service";

export interface EarningsOverview {
  currentBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  lastPayoutDate?: string;
  nextPayoutDate?: string;
  minimumThreshold: number;
}

export interface MonthlyEarning {
  month: number;
  year: number;
  totalViews: number;
  grossEarnings: number;
  platformFees: number;
  netEarnings: number;
  payoutExecuted: boolean;
  payoutDate?: string;
  campaignCount: number;
}

export interface TransactionHistory {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  campaignId?: string;
  campaignTitle?: string;
  createdAt: string;
  processedAt?: string;
  stripeTransactionId?: string;
}

export interface CampaignEarningsBreakdown {
  campaignId: string;
  campaignTitle: string;
  campaignType: string;
  viewsGenerated: number;
  cpvRate: number;
  grossEarnings: number;
  netEarnings: number;
  month: number;
  year: number;
  payoutExecuted: boolean;
}

export interface EarningsAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  averageMonthlyEarnings: number;
  topPerformingCampaign: {
    title: string;
    earnings: number;
  };
  earningsTrend: {
    period: string;
    earnings: number;
    views: number;
  }[];
  viewsDistribution: {
    campaignTitle: string;
    views: number;
    percentage: number;
  }[];
}

export interface PayoutHistory {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt?: string;
  method: string;
  stripeTransferId?: string;
  description?: string;
}

export interface EarningsStatistics {
  currentMonthStats: {
    totalViews: number;
    estimatedEarnings: number;
    activeCampaigns: number;
    viewsGrowth: number; // percentage change from last month
  };
  yearToDateStats: {
    totalEarnings: number;
    totalViews: number;
    totalPayouts: number;
    averageMonthlyEarnings: number;
  };
  performanceMetrics: {
    averageCPV: number;
    totalCampaignsParticipated: number;
    successRate: number; // percentage of campaigns that qualified for payout
    engagementScore: number;
  };
}

class PromoterEarningsService {
  private readonly baseEndpoint = "/statistics/promoter";

  /**
   * Get promoter earnings overview
   */
  async getEarningsOverview(): Promise<EarningsOverview> {
    const response = await httpService.get<EarningsOverview>(
      `${this.baseEndpoint}/overview`,
      true
    );
    return response.data;
  }

  /**
   * Get monthly earnings breakdown
   */
  async getMonthlyEarnings(
    year?: number,
    limit?: number
  ): Promise<MonthlyEarning[]> {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (limit) params.append("limit", limit.toString());

    const endpoint = `${this.baseEndpoint}/monthly-earnings${
      params.toString() ? `?${params}` : ""
    }`;
    const response = await httpService.get<MonthlyEarning[]>(endpoint, true);
    return response.data;
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    page: number = 1,
    limit: number = 20,
    type?: string,
    status?: string
  ): Promise<{
    transactions: TransactionHistory[];
    total: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type) params.append("type", type);
    if (status) params.append("status", status);

    const response = await httpService.get<{
      transactions: TransactionHistory[];
      total: number;
      totalPages: number;
    }>(`${this.baseEndpoint}/transactions?${params}`, true);
    return response.data;
  }

  /**
   * Get campaign earnings breakdown
   */
  async getCampaignEarningsBreakdown(
    month?: number,
    year?: number
  ): Promise<CampaignEarningsBreakdown[]> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const endpoint = `${this.baseEndpoint}/campaign-breakdown${
      params.toString() ? `?${params}` : ""
    }`;
    const response = await httpService.get<CampaignEarningsBreakdown[]>(
      endpoint,
      true
    );
    return response.data;
  }

  /**
   * Get earnings analytics and insights
   */
  async getEarningsAnalytics(
    period: "month" | "quarter" | "year" = "year"
  ): Promise<EarningsAnalytics> {
    const response = await httpService.get<EarningsAnalytics>(
      `${this.baseEndpoint}/analytics?period=${period}`,
      true
    );
    return response.data;
  }

  /**
   * Get payout history
   */
  async getPayoutHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{ payouts: PayoutHistory[]; total: number; totalPages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await httpService.get<{
      payouts: PayoutHistory[];
      total: number;
      totalPages: number;
    }>(`${this.baseEndpoint}/payouts?${params}`, true);
    return response.data;
  }

  /**
   * Get detailed earnings statistics
   */
  async getEarningsStatistics(): Promise<EarningsStatistics> {
    const response = await httpService.get<EarningsStatistics>(
      `${this.baseEndpoint}/statistics`,
      true
    );
    return response.data;
  }

  /**
   * Request a payout
   */
  async requestPayout(
    amount: number,
    method: string = "BANK_TRANSFER"
  ): Promise<{ success: boolean; message: string; payoutId?: string }> {
    const response = await httpService.post<{
      success: boolean;
      message: string;
      payoutId?: string;
    }>(
      `${this.baseEndpoint}/request-payout`,
      {
        amount,
        method,
      },
      true
    );
    return response.data;
  }

  /**
   * Get earnings trends for charts
   */
  async getEarningsTrends(
    period: "week" | "month" | "quarter" | "year" = "month",
    limit: number = 12
  ): Promise<{
    labels: string[];
    earnings: number[];
    views: number[];
    campaigns: number[];
  }> {
    const response = await httpService.get<{
      labels: string[];
      earnings: number[];
      views: number[];
      campaigns: number[];
    }>(`${this.baseEndpoint}/trends?period=${period}&limit=${limit}`, true);
    return response.data;
  }
}

export const promoterEarningsService = new PromoterEarningsService();
